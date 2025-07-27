import { useEffect, useState } from "react";

interface Company {
  name: string;
  logo: string;
  alt: string;
}

interface CompanyMarqueeProps {
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export default function CompanyMarquee({
  speed = 40,
  pauseOnHover = true,
  className = "",
}: CompanyMarqueeProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompanyLogos = async () => {
      try {
        // Use Vite's import.meta.glob to dynamically discover all logo files
        const logoModules = import.meta.glob('/public/logos/*', { 
          eager: true,
          as: 'url'
        });

        const loadedCompanies: Company[] = [];

        // Process each discovered logo file
        Object.keys(logoModules).forEach((path) => {
          // Extract filename with extension
          const filename = path.split('/').pop();
          if (filename) {
            // Remove extension for display name
            const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
            
            // Convert filename to readable company name (optional formatting)
            const companyName = nameWithoutExt
              .split(/[-_]/) // Split on hyphens or underscores
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            // Create logo path for public access
            const logoPath = `/logos/${filename}`;

            loadedCompanies.push({
              name: companyName,
              logo: logoPath,
              alt: `${companyName} logo`,
            });
          }
        });

        // Sort companies alphabetically for consistent display
        loadedCompanies.sort((a, b) => a.name.localeCompare(b.name));
        setCompanies(loadedCompanies);
      } catch (error) {
        console.warn('Failed to load company logos:', error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyLogos();
  }, []);

  if (isLoading) {
    return (
      <div className={`relative overflow-hidden py-4 ${className}`}>
        <div className="flex space-x-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-36 h-16 bg-gray-200/50 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return null; // Don't render if no logos found
  }

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];
  const itemWidth = 9.5; // rem (w-38 equivalent)
  const totalWidth = duplicatedCompanies.length * itemWidth;

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />
      
      <div
        className={`flex space-x-6 ${pauseOnHover ? "hover:animation-pause" : ""}`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: `${totalWidth}rem`,
        }}
      >
        {duplicatedCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex-shrink-0 w-36 h-16 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300 group cursor-default"
          >
            <img
              src={company.logo}
              alt={company.alt}
              className="max-w-28 max-h-10 object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div class="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors px-3 text-center leading-tight">
                      ${company.name}
                    </div>
                  `;
                }
              }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .hover\\:animation-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}