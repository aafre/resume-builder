/**
 * Translate Job Title Edge Function
 * Converts niche/unusual job titles into standard, commonly-advertised equivalents
 * using OpenAI gpt-4o-mini.
 *
 * Called by the Python backend (server-to-server) as Tier 3 fallback
 * when keyword-based job search returns too few results.
 *
 * POST { title: string }
 * → { success: true, terms: string[] }
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'npm:openai@4.20.1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    const { title } = await req.json();
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'title is required' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You convert job titles into standard, commonly-advertised equivalents. ' +
            'Return ONLY a comma-separated list of 3 standard job titles. No numbering, no explanations.',
        },
        {
          role: 'user',
          content: `Convert this job title into 3 standard, commonly advertised job titles: "${title.trim()}"`,
        },
      ],
      max_tokens: 60,
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const terms = raw
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)
      .slice(0, 3);

    console.log(`Translated "${title}" → [${terms.join(', ')}]`);

    return new Response(
      JSON.stringify({ success: true, terms }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('translate-job-title error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Translation failed' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
