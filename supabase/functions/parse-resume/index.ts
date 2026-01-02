/**
 * Resume Parser Edge Function
 * AI-powered resume parsing backend using OpenAI gpt-4o-mini
 *
 * Flow:
 * 1. Authenticate user via JWT
 * 2. Calculate file hash (SHA-256) for caching
 * 3. Check cache (DB lookup by hash) - return if hit
 * 4. Validate file (type, size, magic numbers)
 * 5. Extract text (PDF/DOCX)
 * 6. Guard rail check (is this a resume?)
 * 7. Call OpenAI gpt-4o-mini
 * 8. Validate response schema
 * 9. Convert to YAML
 * 10. Cache in DB
 * 11. Return YAML to frontend
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.38.0';

// Utilities
import { calculateSHA256 } from './utils/hash.ts';
import { isLikelyResume } from './utils/resume-detector.ts';
import { convertToYAML } from './utils/yaml-converter.ts';
import { validateFile } from './utils/file-validator.ts';

// Extractors
import { extractTextFromPDF } from './extractors/pdf-extractor.ts';
import { extractTextFromDOCX } from './extractors/docx-extractor.ts';

// AI Integration
import { parseResumeWithAI } from './ai/openai-client.ts';
import { validateResumeSchema } from './ai/validator.ts';

// CORS headers for browser access
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Main Edge Function handler
 */
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // === 1. Authenticate user ===
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Authorization header' }),
        {
          status: 401,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;

    // Supabase automatically injects SUPABASE_SERVICE_ROLE_KEY into edge function runtime
    // This is the service_role key from Dashboard → Settings → API
    // No need to manually set this secret - it's always available
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // DEBUG: Log key format (first 20 chars only for security)
    console.log('🔑 Service key format:', supabaseServiceKey.substring(0, 20) + '...');
    console.log('🔑 Token being verified (first 50 chars):', token.substring(0, 50) + '...');

    // Create admin client for both auth validation and cache operations
    // Service role key automatically available in edge function environment
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT using admin client
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ Auth failed:', authError?.message || 'No user');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const userId = user.id;
    console.log('✅ Authenticated user:', userId);

    // === 2. Parse multipart form data ===
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file provided' }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('File uploaded:', file.name, file.type, file.size, 'bytes');

    // === 3. Calculate file hash for caching ===
    const fileBuffer = await file.arrayBuffer();
    const fileHash = await calculateSHA256(fileBuffer);
    console.log('File hash:', fileHash);

    // === 4. Check cache (by hash) - using admin client for global deduplication ===
    const { data: cached } = await supabaseAdmin
      .from('parsed_resumes')
      .select('parsed_yaml, confidence_score, warnings, created_at')
      .eq('file_hash', fileHash)
      .gt('expires_at', new Date().toISOString()) // Not expired
      .single();

    if (cached) {
      console.log('Cache hit! Returning cached result.');

      // Hallucination check for cached results
      const cachedWarnings = [...(cached.warnings || [])];
      if (cached.confidence_score < 0.9) {
        cachedWarnings.push(
          'AI-generated content: Please carefully review all details for accuracy.'
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          yaml: cached.parsed_yaml,
          confidence: cached.confidence_score,
          warnings: cachedWarnings,
          cached: true,
          cached_at: cached.created_at,
          ui_message: {
            title: 'Resume Imported Successfully',
            description:
              'Please review your details carefully. AI-generated content may contain inaccuracies.',
            type: cached.confidence_score >= 0.9 ? 'success' : 'warning',
          },
        }),
        {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Cache miss. Proceeding with parsing...');

    // === 5. Validate file (type, size, magic numbers) ===
    const validation = await validateFile(file);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('File validated:', validation.fileType);

    // === 6. Extract text ===
    let rawText: string;
    try {
      if (validation.fileType === 'pdf') {
        rawText = await extractTextFromPDF(fileBuffer);
      } else if (validation.fileType === 'docx') {
        rawText = await extractTextFromDOCX(fileBuffer);
      } else {
        throw new Error('Unsupported file type');
      }

      console.log('Text extracted:', rawText.length, 'characters');
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Text extraction failed: ${error.message}`,
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // === 7. Guard rail: Is this a resume? ===
    if (!isLikelyResume(rawText)) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'We analyzed your file and it does not look like a resume. Please ensure you are uploading a valid resume.',
        }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Resume detected (passed keyword check)');

    // === 8. Parse with AI ===
    let aiResult;
    try {
      aiResult = await parseResumeWithAI(rawText);
      console.log('AI parsing complete. Confidence:', aiResult.confidence);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `AI parsing failed: ${error.message}`,
          raw_text: rawText.slice(0, 1000), // Return first 1000 chars for debugging
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // === 9. Confidence check ===
    if (aiResult.confidence < 0.6) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Low confidence: File may not be a valid resume or is poorly formatted. Please try a different file.',
          confidence: aiResult.confidence,
          warnings: aiResult.warnings,
        }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // === 10. Validate schema ===
    const schemaValidation = validateResumeSchema(aiResult.json);
    if (!schemaValidation.valid) {
      console.error('Schema validation failed:', schemaValidation.errors);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parsing failed validation. Please try a different resume or contact support.',
          validation_errors: schemaValidation.errors,
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Schema validation passed');

    // Merge AI warnings with validator warnings
    const combinedWarnings = [
      ...aiResult.warnings,
      ...schemaValidation.warnings
    ];

    // === 11. Convert to YAML ===
    let yamlOutput: string;
    try {
      yamlOutput = convertToYAML(aiResult.json);
      console.log('Converted to YAML:', yamlOutput.length, 'characters');
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `YAML conversion failed: ${error.message}`,
        }),
        {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // === 12. Cache result - using admin client for global cache ===
    const { error: cacheError } = await supabaseAdmin.from('parsed_resumes').insert({
      user_id: userId,
      file_hash: fileHash,
      file_name: file.name,
      file_size: file.size,
      file_type: validation.fileType,
      raw_text: rawText,
      parsed_yaml: yamlOutput,
      parsed_json: aiResult.json,
      confidence_score: aiResult.confidence,
      warnings: combinedWarnings,
      openai_model: 'gpt-4o-mini',
    });

    if (cacheError) {
      // Handle race condition: another request might have cached it while we were parsing
      if (cacheError.code === '23505') {
        console.log('Cache insert race condition - another request cached this file concurrently');
        // Non-fatal: the cache entry exists, which is what we wanted
      } else {
        console.error('Cache insert failed (non-fatal):', cacheError);
      }
      // Continue anyway - caching failure shouldn't block response
    } else {
      console.log('Result cached successfully');
    }

    // === 13. Hallucination Check ===
    // Add warning about AI-generated content that should be reviewed
    const hallucination_warning =
      'AI-generated content: Please carefully review all details for accuracy.';

    const allWarnings = [...combinedWarnings];
    if (aiResult.confidence < 0.9) {
      allWarnings.push(hallucination_warning);
    }

    // === 14. Return YAML ===
    return new Response(
      JSON.stringify({
        success: true,
        yaml: yamlOutput,
        confidence: aiResult.confidence,
        warnings: allWarnings,
        cached: false,
        file_info: {
          name: file.name,
          size: file.size,
          type: validation.fileType,
        },
        // UI should display: "Resume Imported Successfully - Please review your details"
        ui_message: {
          title: 'Resume Imported Successfully',
          description: 'Please review your details carefully. AI-generated content may contain inaccuracies.',
          type: aiResult.confidence >= 0.9 ? 'success' : 'warning',
        },
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
