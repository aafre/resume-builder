import { useState } from "react";

interface UserAvatarProps {
  name: string;
  url?: string | null;
  /** Pixel size; also sets the intrinsic width/height so nothing shifts on load */
  size?: number;
  className?: string;
}

/** Photo when there is one that loads, otherwise the initial on ink. */
export default function UserAvatar({ name, url, size = 32, className = "" }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size };

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        style={box}
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover ring-2 ring-accent/20 ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...box, fontSize: size * 0.42 }}
      className={`inline-flex items-center justify-center rounded-full bg-ink font-semibold text-white ${className}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
