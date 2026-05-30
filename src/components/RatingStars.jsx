export default function RatingStars({ rating, size = 'md' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass}`}>
      <span className="flex" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={`full-${i}`} className="text-amber-400">★</span>
        ))}
        {hasHalf && <span className="text-amber-400 opacity-60">★</span>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </span>
      <span className="text-sm font-semibold text-on-surface ml-0.5">{rating}</span>
    </span>
  );
}
