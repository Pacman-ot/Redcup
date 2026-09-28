// next/image loader for sample photos.
// src format: "/photo/<picsum id>/<width / height ratio>", built by photoSrc().
export default function picsumLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const match = src.match(/^\/photo\/(\d+)\/([\d.]+)$/);
  if (!match) return src;
  const [, id, ratio] = match;
  const height = Math.round(width / Number(ratio));
  return `https://picsum.photos/id/${id}/${width}/${height}.webp`;
}
