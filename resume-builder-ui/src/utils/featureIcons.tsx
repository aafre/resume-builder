/**
 * Feature Icons Utility
 * Maps emoji strings from seoPages.ts to Lucide React SVG icons
 * rendered inside styled gradient containers.
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

/** 6-color rotation: each index mod 6 gets a unique gradient theme */
const colorThemes = [
  { bg: 'from-blue-50 to-indigo-50', icon: 'text-blue-600' },
  { bg: 'from-purple-50 to-fuchsia-50', icon: 'text-purple-600' },
  { bg: 'from-emerald-50 to-teal-50', icon: 'text-emerald-600' },
  { bg: 'from-amber-50 to-orange-50', icon: 'text-amber-600' },
  { bg: 'from-indigo-50 to-violet-50', icon: 'text-indigo-600' },
  { bg: 'from-rose-50 to-pink-50', icon: 'text-rose-600' },
] as const;

export function getColorTheme(index: number) {
  return colorThemes[((index % colorThemes.length) + colorThemes.length) % colorThemes.length];
}

/**
 * Renders an emoji as a Lucide SVG icon inside a gradient container.
 * Falls back to rendering the raw emoji in a neutral container if unmapped.
 */
export function FeatureIcon({ emoji, index }: { emoji: string; index: number }) {
  const IconComponent = emojiToIcon[emoji];
  const theme = getColorTheme(index);

  if (IconComponent) {
    return (
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.bg} shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
      >
        <IconComponent className={`w-7 h-7 ${theme.icon}`} />
      </div>
    );
  }

  // Fallback: unknown emoji in a neutral container
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 transition-all duration-300">
      <span className="text-2xl">{emoji}</span>
    </div>
  );
}
