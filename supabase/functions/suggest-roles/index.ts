/**
 * Suggest Roles Edge Function
 * Given a job title, skills, and career history, suggests alternative roles
 * the user may be qualified for based on transferable skills.
 *
 * Called by the Python backend (server-to-server).
 *
 * POST { title: string, skills: string[], experience_titles: string[] }
 * -> { success: true, primary_role: string, alternative_roles: string[], confidence: number }
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
    const { title, skills, experience_titles } = await req.json();
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

    const skillsList = Array.isArray(skills) ? skills.join(', ') : '';
    const careerPath = Array.isArray(experience_titles) ? experience_titles.join(' -> ') : '';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a career advisor. Given a job title, skills, and career history, suggest roles. ' +
            'Return ONLY JSON: {"primary_role":"...","alternative_roles":["...","...","..."],"confidence":85} ' +
            'primary_role = standardized current title. alternative_roles = 3 different roles ' +
            'based on transferable skills. confidence = 0-100.',
        },
        {
          role: 'user',
          content: `Title: ${title.trim()}${skillsList ? ` | Skills: ${skillsList}` : ''}${careerPath ? ` | Career: ${careerPath}` : ''}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';

    // Parse JSON response from the model
    const parsed = JSON.parse(raw);
    const result = {
      primary_role: typeof parsed.primary_role === 'string' ? parsed.primary_role : title.trim(),
      alternative_roles: Array.isArray(parsed.alternative_roles)
        ? parsed.alternative_roles.filter((r: unknown) => typeof r === 'string' && r.trim()).slice(0, 3)
        : [],
      confidence: typeof parsed.confidence === 'number' ? Math.min(100, Math.max(0, parsed.confidence)) : 50,
    };

    console.log(`Suggested roles for "${title}": primary="${result.primary_role}", alternatives=[${result.alternative_roles.join(', ')}]`);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('suggest-roles error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Role suggestion failed' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
