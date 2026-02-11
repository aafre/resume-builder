// Static imports for all company logos
import appleLogoUrl from '/logos/apple.svg';
import bloombergLogoUrl from '/logos/bloomberg.svg';
import bnppLogoUrl from '/logos/bnpp.svg';
import googleLogoUrl from '/logos/google.svg';
import jpmorganLogoUrl from '/logos/jpmorgan.svg';
import metaLogoUrl from '/logos/meta.svg';
import morganstanleyLogoUrl from '/logos/morganstanley.svg';
import msciLogoUrl from '/logos/msci.svg';
import servicenowLogoUrl from '/logos/servicenow.svg';
import skiptonLogoUrl from '/logos/skipton.svg';

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

// Hardcoded companies array for immediate availability
const companies: Company[] = [
  { name: 'Apple', logo: appleLogoUrl, alt: 'Apple logo' },
  { name: 'Bloomberg', logo: bloombergLogoUrl, alt: 'Bloomberg logo' },
  { name: 'BNP Paribas', logo: bnppLogoUrl, alt: 'BNP Paribas logo' },
  { name: 'Google', logo: googleLogoUrl, alt: 'Google logo' },
  { name: 'JPMorgan', logo: jpmorganLogoUrl, alt: 'JPMorgan logo' },
  { name: 'Meta', logo: metaLogoUrl, alt: 'Meta logo' },
  { name: 'Morgan Stanley', logo: morganstanleyLogoUrl, alt: 'Morgan Stanley logo' },
  { name: 'MSCI', logo: msciLogoUrl, alt: 'MSCI logo' },
  { name: 'ServiceNow', logo: servicenowLogoUrl, alt: 'ServiceNow logo' },
  { name: 'Skipton', logo: skiptonLogoUrl, alt: 'Skipton logo' },
];

export default function CompanyMarquee({
  speed = 40,
  pauseOnHover = true,
  className = "",
}: CompanyMarqueeProps) {

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];
  const itemWidth = 9.5; // rem (w-38 equivalent)
  const totalWidth = duplicatedCompanies.length * itemWidth;

  return (
    <div className={`relative overflow-hidden h-24 ${className}`}>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-chalk via-chalk/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-chalk via-chalk/90 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex space-x-6 ${
          pauseOnHover ? "hover:animation-pause" : ""
        }`}
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: `${totalWidth}rem`,
        }}
      >
        {duplicatedCompanies.map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex-shrink-0 w-36 h-16 flex items-center justify-center group cursor-default"
          >
            <img
              src={company.logo}
              alt={company.alt}
              className="max-w-28 max-h-10 object-contain transition-all duration-500"
              width="112"
              height="40"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                const container = target.parentElement;
                if (container) {
                  container.innerHTML = `
                    <div class="text-sm font-semibold text-stone-warm group-hover:text-ink transition-colors px-3 text-center leading-tight font-display">
                      ${company.name}
                    </div>
                  `;
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
