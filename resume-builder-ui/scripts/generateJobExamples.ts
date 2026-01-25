#!/usr/bin/env npx tsx
/**
 * Job Examples YAML Generator
 * Uses Claude API to generate professional resume examples
 *
 * Usage:
 *   ANTHROPIC_API_KEY=your_key npx tsx scripts/generateJobExamples.ts
 *
 * Options:
 *   --dry-run     Preview without saving files
 *   --job=slug    Generate a single job (e.g., --job=warehouse-worker)
 *   --tier=N      Generate only a specific tier (1-5)
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ALL_JOBS, EXISTING_JOBS, getJobsToGenerate, type JobConfig } from './jobExamples.config.js';

const client = new Anthropic();

// ES Module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'examples');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function buildPrompt(job: JobConfig): string {
  const experienceLevelContext = {
    student: 'This person is a student with limited or no work experience. Focus on education, coursework, volunteer work, and transferable skills.',
    entry: 'This person has 0-2 years of experience. Include 1-2 relevant jobs and focus on skills and potential.',
    mid: 'This person has 3-7 years of experience. Include 2-3 jobs with strong accomplishments and metrics.',
    senior: 'This person has 8+ years of experience. Include 3 jobs with leadership accomplishments and strategic impact.',
  };

  const categoryContext = {
    service: 'Focus on customer satisfaction, communication, reliability, and handling difficult situations.',
    corporate: 'Emphasize organizational skills, communication, process improvement, and cross-functional collaboration.',
    healthcare: 'Highlight patient care, clinical skills, certifications, and HIPAA compliance.',
    finance: 'Emphasize accuracy, regulatory compliance, financial analysis, and attention to detail.',
    tech: 'Focus on technical skills, project achievements, tools/languages, and measurable impact.',
    student: 'Highlight education, relevant coursework, projects, volunteer work, and transferable skills.',
    trades: 'Emphasize certifications, safety records, technical skills, and hands-on experience.',
  };

  return `Generate a professional resume example for a ${job.title} position in YAML format.

CONTEXT:
- Experience Level: ${job.experienceLevel} (${experienceLevelContext[job.experienceLevel]})
- Industry Focus: ${categoryContext[job.category]}
- Template Style: ${job.template}

REQUIREMENTS:
1. Use realistic but fictional data (name, companies, etc.)
2. Include quantifiable achievements with specific numbers/percentages
3. Use strong action verbs (Led, Achieved, Implemented, Reduced, etc.)
4. Include 4-5 bullet points per job for mid/senior, 3-4 for entry/student
5. Skills should be industry-specific and ATS-friendly
6. Bullet bank should have 12-16 extra bullets organized by category

OUTPUT FORMAT - Follow this YAML structure EXACTLY:

\`\`\`yaml
# ${job.title} Resume Example
# Category: ${job.category} (Tier ${job.tier})

meta:
  slug: ${job.slug}
  title: ${job.title}
  metaTitle: "Free ${job.title} Resume Example & Template (2026)"
  metaDescription: "Professional ${job.title.toLowerCase()} resume example with proven achievements. ATS-optimized, ready to customize. Download free."
  category: ${job.category}
  priority: ${job.priority}

resume:
  template: ${job.template}
  contact:
    name: [Realistic first and last name]
    title: ${job.title}
    email: [firstname.lastname@email.com]
    phone: "(555) XXX-XXXX"
    location: [City, State]

  summary: >
    [2-3 sentence professional summary highlighting experience, key skills, and value proposition]

  experience:
    - company: [Company Name]
      title: [Job Title]
      dates: [Month Year] - Present
      location: [City, State]
      bullets:
        - [Achievement with metrics]
        - [Achievement with metrics]
        - [Achievement with metrics]
        - [Achievement with metrics]

    - company: [Previous Company]
      title: [Previous Title]
      dates: [Month Year] - [Month Year]
      location: [City, State]
      bullets:
        - [Achievement with metrics]
        - [Achievement with metrics]
        - [Achievement with metrics]

  education:
    - school: [School Name]
      degree: [Degree Type and Major]
      year: "[Graduation Year]"

  skills:
    - [Skill 1]
    - [Skill 2]
    - [etc - 8-12 relevant skills]

bulletBank:
  - category: [Category 1 - e.g., "Customer Service Excellence"]
    bullets:
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"

  - category: [Category 2 - e.g., "Leadership & Training"]
    bullets:
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"

  - category: [Category 3 - role-specific]
    bullets:
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"
      - "[Bullet with metric]"

relatedJobs:
  - [related-job-slug-1]
  - [related-job-slug-2]
  - [related-job-slug-3]
\`\`\`

IMPORTANT:
- Output ONLY the YAML content, no explanation
- Use realistic company names appropriate for the industry
- All bullet points must start with strong action verbs
- Include specific numbers (%, $, counts) in achievements
- Skills should be exactly what ATS systems scan for this role`;
}

async function generateYaml(job: JobConfig): Promise<string> {
  console.log(`  Generating ${job.title}...`);

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2500,
    messages: [
      {
        role: 'user',
        content: buildPrompt(job),
      },
    ],
  });

  // Extract text content
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Extract YAML from markdown code block if present
  let yaml = content.text;
  const yamlMatch = yaml.match(/```ya?ml\n([\s\S]*?)\n```/);
  if (yamlMatch) {
    yaml = yamlMatch[1];
  }

  return yaml.trim();
}

async function saveYaml(job: JobConfig, yaml: string): Promise<void> {
  const filePath = path.join(OUTPUT_DIR, `${job.slug}.yml`);
  fs.writeFileSync(filePath, yaml, 'utf-8');
  console.log(`  Saved: ${filePath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const singleJob = args.find(a => a.startsWith('--job='))?.split('=')[1];
  const tierFilter = args.find(a => a.startsWith('--tier='))?.split('=')[1];

  console.log('\n=== Job Examples YAML Generator ===\n');

  let jobsToGenerate: JobConfig[];

  if (singleJob) {
    const job = ALL_JOBS.find(j => j.slug === singleJob);
    if (!job) {
      console.error(`Job not found: ${singleJob}`);
      console.log('Available jobs:', ALL_JOBS.map(j => j.slug).join(', '));
      process.exit(1);
    }
    jobsToGenerate = [job];
  } else if (tierFilter) {
    const tier = parseInt(tierFilter, 10);
    jobsToGenerate = getJobsToGenerate().filter(j => j.tier === tier);
  } else {
    jobsToGenerate = getJobsToGenerate();
  }

  console.log(`Jobs to generate: ${jobsToGenerate.length}`);
  console.log(`Already exist: ${EXISTING_JOBS.length}`);
  console.log(`Dry run: ${dryRun}\n`);

  if (dryRun) {
    console.log('Jobs that would be generated:');
    jobsToGenerate.forEach(job => {
      console.log(`  - ${job.slug} (Tier ${job.tier}, ${job.template})`);
    });
    return;
  }

  // Process jobs with rate limiting
  let successCount = 0;
  let errorCount = 0;

  for (const job of jobsToGenerate) {
    try {
      const yaml = await generateYaml(job);
      await saveYaml(job, yaml);
      successCount++;

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ERROR generating ${job.slug}:`, error);
      errorCount++;
    }
  }

  console.log('\n=== Generation Complete ===');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total files: ${fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.yml')).length}`);
}

main().catch(console.error);
