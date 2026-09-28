import Image from "next/image";
import { photoSrc } from "@/lib/creators";

interface PhotoProps {
  id: number;
  /** width / height of the frame, e.g. 0.75 for 3:4 */
  ratio: number;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

// A photo that fills a frame of a fixed aspect ratio. Space is reserved
// before the image loads, so nothing shifts.
export function Photo({ id, ratio, alt, sizes, priority, className = "", imgClassName = "" }: PhotoProps) {
  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`} style={{ aspectRatio: String(ratio) }}>
      <Image
        src={photoSrc(id, ratio)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}

export function Avatar({ id, name, size = 48, className = "" }: { id: number; name: string; size?: number; className?: string }) {
  return (
    <Image
      src={photoSrc(id, 1)}
      alt=""
      title={name}
      width={size}
      height={size}
      className={`shrink-0 rounded-full bg-surface-2 object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
