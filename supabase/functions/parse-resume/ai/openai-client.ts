/**
 * OpenAI API client
 * Handles communication with OpenAI gpt-4o-mini for resume parsing
 */

import OpenAI from 'npm:openai@4.20.1';
import { SYSTEM_PROMPT } from './prompts.ts';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!,
});

export interface ParseResult {
  json: any; // Parsed resume JSON
  confidence: number; // AI confidence score (0.0-1.0)
  warnings: string[]; // Parsing warnings
}

/**
 * Parse resume text using OpenAI gpt-4o-mini
 * @param text - Raw text extracted from resume file
 * @returns Parsed resume JSON with confidence and warnings
 * @throws Error if OpenAI API call fails
 */
export async function parseResumeWithAI(text: string): Promise<ParseResult> {
  // Limit text length to prevent prompt injection via massive text
  // and to stay within token limits
  const truncatedText = text.slice(0, 50000);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Parse this resume text into JSON:\n\n${truncatedText}`,
        },
      ],
      response_format: { type: 'json_object' }, // Force JSON output
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('OpenAI returned empty response');
    }

    // Parse JSON response
    const parsed = JSON.parse(responseText);

    // Extract metadata
    const confidence = parsed.confidence || 0.5;
    const warnings = parsed.warnings || [];

    return {
      json: parsed,
      confidence,
      warnings,
    };
  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${error.message}`);
    }

    // Re-throw other errors
    throw error;
  }
}
