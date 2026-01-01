/**
 * HighlightedText Component
 * Safely highlights specified keywords in text without using dangerouslySetInnerHTML
 * Prevents XSS vulnerabilities by using React elements instead of HTML injection
 */

interface HighlightedTextProps {
  text: string;
  keywords: string[];
  className?: string;
}

export default function HighlightedText({ text, keywords, className = '' }: HighlightedTextProps) {
  if (keywords.length === 0) {
    return <p className={className}>{text}</p>;
  }

  // Escape special regex characters in keywords
  const escapedKeywords = keywords.map(keyword =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // Create regex pattern to match any of the keywords (case-insensitive)
  const pattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

  // Split text by keywords while keeping the keywords in the result
  const parts = text.split(pattern);

  return (
    <p className={className}>
      {parts.map((part, index) => {
        // Check if this part matches any keyword (case-insensitive)
        const isKeyword = keywords.some(
          keyword => keyword.toLowerCase() === part.toLowerCase()
        );

        if (isKeyword) {
          return <strong key={index}>{part}</strong>;
        }

        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
