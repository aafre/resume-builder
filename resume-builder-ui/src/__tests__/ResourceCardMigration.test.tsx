/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensures no leftover inline Link card patterns exist in files that
 * should be using the ResourceCard component instead.
 */

const SEO_DIR = path.resolve(__dirname, '../components/seo');

// Files that were migrated to ResourceCard
const MIGRATED_FILES = [
  'ResumeBuilderForITProfessionals.tsx',
  'ResumeBuilderForNurses.tsx',
  'ResumeBuilderForStudents.tsx',
  'ResumeBuilderForVeterans.tsx',
];

// The old inline pattern: <Link ... className="bg-chalk-dark rounded-xl p-5 ...">
const INLINE_CARD_LINK_PATTERN =
  /<Link\s[^>]*className="bg-chalk-dark rounded-xl p-5[^"]*"[^>]*>/;

describe('ResourceCard migration completeness', () => {
  for (const file of MIGRATED_FILES) {
    it(`${file} has no leftover inline card-style <Link> blocks`, () => {
      const filePath = path.join(SEO_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(new RegExp(INLINE_CARD_LINK_PATTERN, 'g'));
      expect(matches).toBeNull();
    });

    it(`${file} imports ResourceCard`, () => {
      const filePath = path.join(SEO_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain("import ResourceCard from '../shared/ResourceCard'");
    });

    it(`${file} uses at least one <ResourceCard`, () => {
      const filePath = path.join(SEO_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('<ResourceCard');
    });
  }
});
