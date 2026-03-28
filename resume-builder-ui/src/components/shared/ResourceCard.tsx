import { Link } from 'react-router-dom';

interface ResourceCardProps {
  to: string;
  title: string;
  description: string;
}

export default function ResourceCard({ to, title, description }: ResourceCardProps) {
  return (
    <Link
      to={to}
      className="bg-chalk-dark rounded-xl p-5 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/[0.04]"
    >
      <h3 className="font-bold text-ink mb-1">{title}</h3>
      <p className="text-stone-warm text-sm">{description}</p>
    </Link>
  );
}
