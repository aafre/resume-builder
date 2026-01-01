#!/usr/bin/env node

/**
 * Email Template Build Script
 *
 * This script processes email templates from the src/ directory and generates
 * production-ready templates with inlined CSS in the root directory.
 *
 * Usage: npm run build
 */

const juice = require('juice');
const fs = require('fs-extra');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = __dirname;

// Templates to build
// Add templates here as you migrate them to src/
const templates = [
  'magic-link.html'
  // 'confirm-signup.html',
  // 'reset-password.html',
  // 'change-email.html',
  // 'base-template.html'
];

// Juice options for optimal email compatibility
const juiceOptions = {
  preserveMediaQueries: true, // Keep @media queries for responsive design
  preserveFontFaces: true,    // Keep @font-face declarations
  removeStyleTags: false,     // Keep <style> tag as fallback for modern clients
  preserveImportant: true,    // Preserve !important declarations
  inlinePseudoElements: false // Don't inline :hover, :focus, etc.
};

async function buildTemplate(templateName) {
  const srcPath = path.join(SRC_DIR, templateName);
  const distPath = path.join(DIST_DIR, templateName);

  try {
    console.log(`Building ${templateName}...`);

    // Read source template
    const html = await fs.readFile(srcPath, 'utf8');

    // Inline CSS
    const inlined = juice(html, juiceOptions);

    // Write to dist
    await fs.writeFile(distPath, inlined, 'utf8');

    console.log(`✓ ${templateName} built successfully`);
  } catch (error) {
    console.error(`✗ Error building ${templateName}:`, error.message);
    throw error;
  }
}

async function buildAll() {
  console.log('Building email templates...\n');

  try {
    // Build all templates
    for (const template of templates) {
      await buildTemplate(template);
    }

    console.log('\n✓ All templates built successfully!');
    console.log(`\nBuilt templates are in: ${DIST_DIR}`);
    console.log('You can now copy these to Supabase Email Templates.');
  } catch (error) {
    console.error('\n✗ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
buildAll();
