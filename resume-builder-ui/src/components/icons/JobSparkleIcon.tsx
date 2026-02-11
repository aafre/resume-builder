import { Briefcase, Sparkle } from 'lucide-react';

interface JobSparkleIconProps {
  className?: string;
}

/** Composite icon: Briefcase with a small Sparkle in the top-right corner. */
export const JobSparkleIcon: React.FC<JobSparkleIconProps> = ({ className }) => (
  <span className={`relative inline-flex ${className ?? ''}`}>
    <Briefcase className="w-full h-full" />
    <Sparkle className="absolute -top-[3px] -right-[3px] w-[55%] h-[55%] text-accent fill-accent" />
  </span>
);
