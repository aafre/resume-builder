// src/services/__tests__/sectionConversion.test.ts
import { describe, it, expect } from 'vitest';
import {
  convertSectionType,
  isChangeableType,
  CHANGEABLE_TYPES,
  TYPE_DISPLAY_NAMES,
  ChangeableSectionType,
} from '../sectionService';
import { Section } from '../../types';

describe('isChangeableType', () => {
  it.each([...CHANGEABLE_TYPES])('returns true for %s', (type) => {
    expect(isChangeableType(type)).toBe(true);
  });

  it.each(['experience', 'education', 'icon-list', undefined, '', 'unknown'])('returns false for %s', (type) => {
    expect(isChangeableType(type)).toBe(false);
  });
});

describe('TYPE_DISPLAY_NAMES', () => {
  it('has a display name for every changeable type', () => {
    for (const type of CHANGEABLE_TYPES) {
      expect(TYPE_DISPLAY_NAMES[type]).toBeTruthy();
    }
  });
});

describe('convertSectionType', () => {
  const makeSection = (type: string, content: unknown, overrides?: Partial<Section>): Section => ({
    id: 'test-id',
    name: 'Test Section',
    type,
    content,
    ...overrides,
  } as Section);

  // ─── Same type → no-op ──────────────────────────────

  describe('same type → no-op', () => {
    it('returns the exact same object (reference equality) when type is unchanged', () => {
      const section = makeSection('text', 'Hello world');
      const result = convertSectionType(section, 'text');
      expect(result).toBe(section);
    });

    it.each([...CHANGEABLE_TYPES])('no-op for %s → %s', (type) => {
      const content = type === 'text' ? 'some text' : ['item1', 'item2'];
      const section = makeSection(type, content);
      expect(convertSectionType(section, type as ChangeableSectionType)).toBe(section);
    });
  });

  // ─── text → list types ──────────────────────────────

  describe('text → list types', () => {
    it('splits text by newlines into bulleted-list', () => {
      const section = makeSection('text', 'Line 1\nLine 2\nLine 3');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.type).toBe('bulleted-list');
      expect(result.content).toEqual(['Line 1', 'Line 2', 'Line 3']);
    });

    it('splits text into inline-list', () => {
      const section = makeSection('text', 'Skill A\nSkill B');
      const result = convertSectionType(section, 'inline-list');
      expect(result.type).toBe('inline-list');
      expect(result.content).toEqual(['Skill A', 'Skill B']);
    });

    it('splits text into dynamic-column-list', () => {
      const section = makeSection('text', 'Item 1\nItem 2');
      const result = convertSectionType(section, 'dynamic-column-list');
      expect(result.type).toBe('dynamic-column-list');
      expect(result.content).toEqual(['Item 1', 'Item 2']);
    });

    it('filters empty lines when splitting', () => {
      const section = makeSection('text', 'Line 1\n\n\nLine 2\n  \n');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toEqual(['Line 1', 'Line 2']);
    });

    it('handles empty string content', () => {
      const section = makeSection('text', '');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toEqual([]);
    });

    it('handles whitespace-only text', () => {
      const section = makeSection('text', '   \n  \n\n');
      const result = convertSectionType(section, 'inline-list');
      expect(result.content).toEqual([]);
    });

    it('preserves leading/trailing whitespace within lines', () => {
      const section = makeSection('text', '  indented line\ntrailing space  ');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toEqual(['  indented line', 'trailing space  ']);
    });

    it('handles single line text (no newlines)', () => {
      const section = makeSection('text', 'Just one line');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toEqual(['Just one line']);
    });

    it('handles text with \\r\\n (Windows line endings)', () => {
      const section = makeSection('text', 'Line A\r\nLine B');
      const result = convertSectionType(section, 'bulleted-list');
      // \r\n splits on \n, leaving \r on Line A — this is expected behavior
      // The important thing is it doesn't break
      expect(result.content).toHaveLength(2);
    });
  });

  // ─── list types → text ──────────────────────────────

  describe('list types → text', () => {
    it('joins bulleted-list items with newlines', () => {
      const section = makeSection('bulleted-list', ['Item A', 'Item B', 'Item C']);
      const result = convertSectionType(section, 'text');
      expect(result.type).toBe('text');
      expect(result.content).toBe('Item A\nItem B\nItem C');
    });

    it('joins inline-list items with newlines', () => {
      const section = makeSection('inline-list', ['Tag 1', 'Tag 2']);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('Tag 1\nTag 2');
    });

    it('joins dynamic-column-list items with newlines', () => {
      const section = makeSection('dynamic-column-list', ['Col A', 'Col B']);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('Col A\nCol B');
    });

    it('handles empty list → empty string', () => {
      const section = makeSection('bulleted-list', []);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('');
    });

    it('handles single item list', () => {
      const section = makeSection('inline-list', ['Only item']);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('Only item');
    });

    it('handles list with empty string items', () => {
      const section = makeSection('bulleted-list', ['', 'Real item', '']);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('\nReal item\n');
    });
  });

  // ─── list type → list type ──────────────────────────

  describe('list type → list type', () => {
    it('converts bulleted-list to inline-list preserving content', () => {
      const items = ['React', 'TypeScript', 'Node.js'];
      const section = makeSection('bulleted-list', items);
      const result = convertSectionType(section, 'inline-list');
      expect(result.type).toBe('inline-list');
      expect(result.content).toEqual(items);
    });

    it('converts inline-list to dynamic-column-list preserving content', () => {
      const items = ['Python', 'Go'];
      const section = makeSection('inline-list', items);
      const result = convertSectionType(section, 'dynamic-column-list');
      expect(result.type).toBe('dynamic-column-list');
      expect(result.content).toEqual(items);
    });

    it('converts dynamic-column-list to bulleted-list preserving content', () => {
      const items = ['A', 'B', 'C'];
      const section = makeSection('dynamic-column-list', items);
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.type).toBe('bulleted-list');
      expect(result.content).toEqual(items);
    });

    it('handles empty array between list types', () => {
      const section = makeSection('bulleted-list', []);
      const result = convertSectionType(section, 'dynamic-column-list');
      expect(result.type).toBe('dynamic-column-list');
      expect(result.content).toEqual([]);
    });

    it('does not mutate the original content array', () => {
      const original = ['A', 'B'];
      const section = makeSection('bulleted-list', original);
      const result = convertSectionType(section, 'inline-list');
      // Modify the result
      (result.content as string[]).push('C');
      // Original should be untouched
      expect(original).toEqual(['A', 'B']);
    });
  });

  // ─── Preservation guarantees ────────────────────────

  describe('preserves id and name', () => {
    it('keeps id and name unchanged after conversion', () => {
      const section = makeSection('text', 'Some text');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.id).toBe('test-id');
      expect(result.name).toBe('Test Section');
    });

    it('preserves custom id', () => {
      const section = makeSection('bulleted-list', ['item'], { id: 'custom-uuid' });
      const result = convertSectionType(section, 'text');
      expect(result.id).toBe('custom-uuid');
    });
  });

  // ─── Round-trip conversions ─────────────────────────

  describe('round-trip conversions', () => {
    it('text → bulleted-list → text preserves content', () => {
      const original = 'Line 1\nLine 2\nLine 3';
      const section = makeSection('text', original);
      const asList = convertSectionType(section, 'bulleted-list');
      const backToText = convertSectionType(asList, 'text');
      expect(backToText.content).toBe(original);
    });

    it('bulleted-list → text → bulleted-list preserves content', () => {
      const original = ['Item A', 'Item B'];
      const section = makeSection('bulleted-list', original);
      const asText = convertSectionType(section, 'text');
      const backToList = convertSectionType(asText, 'bulleted-list');
      expect(backToList.content).toEqual(original);
    });

    it('bulleted-list → inline-list → dynamic-column-list preserves content', () => {
      const items = ['X', 'Y', 'Z'];
      const section = makeSection('bulleted-list', items);
      const asInline = convertSectionType(section, 'inline-list');
      const asDynamic = convertSectionType(asInline, 'dynamic-column-list');
      expect(asDynamic.content).toEqual(items);
      expect(asDynamic.type).toBe('dynamic-column-list');
    });
  });

  // ─── Edge cases ─────────────────────────────────────

  describe('edge cases', () => {
    it('handles content with special characters', () => {
      const section = makeSection('text', 'C++ & C#\nNode.js (v18)\n<html> tags');
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toEqual(['C++ & C#', 'Node.js (v18)', '<html> tags']);
    });

    it('handles very long content', () => {
      const longText = Array.from({ length: 1000 }, (_, i) => `Item ${i}`).join('\n');
      const section = makeSection('text', longText);
      const result = convertSectionType(section, 'bulleted-list');
      expect(result.content).toHaveLength(1000);
    });

    it('handles content with markdown formatting', () => {
      const section = makeSection('bulleted-list', ['**bold**', '*italic*', '[link](url)']);
      const result = convertSectionType(section, 'text');
      expect(result.content).toBe('**bold**\n*italic*\n[link](url)');
    });

    it('handles content with unicode characters', () => {
      const section = makeSection('text', 'Rsum\nCaf\nNaive');
      const result = convertSectionType(section, 'inline-list');
      expect(result.content).toEqual(['Rsum', 'Caf', 'Naive']);
    });
  });
});
