/**
 * Feature Icons Utility
 * Maps emoji strings from seoPages.ts to Lucide React SVG icons
 * rendered in ink.
 *
 * This avoids changing the data file (seoPages.ts stays pure string data).
 */

import {
  CircleCheck,
  Palette,
  Download,
  ShieldCheck,
  PenLine,
  Coins,
  Gift,
  Sparkles,
  Ban,
  ClipboardList,
  Bot,
  Briefcase,
  Smartphone,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  FilePen,
  Zap,
  Target,
  Save,
  Globe,
  FileText,
  Type,
  Ruler,
  Shapes,
  Calendar,
  BarChart3,
  RefreshCw,
  GraduationCap,
  Trophy,
  Headset,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

const emojiToIcon: Record<string, LucideIcon> = {
  '✅': CircleCheck,
  '🎨': Palette,
  '📥': Download,
  '🔒': ShieldCheck,
  '✏️': PenLine,
  '💰': Coins,
  '🎁': Gift,
  '✨': Sparkles,
  '🚫': Ban,
  '📋': ClipboardList,
  '🤖': Bot,
  '💼': Briefcase,
  '📱': Smartphone,
  '💡': Lightbulb,
  '📈': TrendingUp,
  '💬': MessageCircle,
  '📝': FilePen,
  '⚡': Zap,
  '🎯': Target,
  '💾': Save,
  '🇬🇧': Globe,
  '📄': FileText,
  '🔤': Type,
  '📏': Ruler,
  '📐': Shapes,
  '📅': Calendar,
  '🤖‍': Bot, // variant with ZWJ
  '📊': BarChart3,
  '🔄': RefreshCw,
  '🎓': GraduationCap,
  '🏆': Trophy,
  '🎧': Headset,
};

/**
 * Renders an emoji as a bare Lucide SVG icon in ink. No tinted tile, no
 * per-index colour rotation: accent is a fill used sparingly (DESIGN.md), and
 * a rainbow of pastel tiles read as six unrelated brands on one page.
 * Falls back to the raw emoji if unmapped.
 */
export function FeatureIcon({ emoji }: { emoji: string }) {
  const IconComponent = emojiToIcon[emoji];

  if (IconComponent) {
    return <IconComponent className="w-7 h-7 text-ink" strokeWidth={1.5} aria-hidden="true" />;
  }

  return (
    <span className="text-2xl leading-none" aria-hidden="true">
      {emoji}
    </span>
  );
}
