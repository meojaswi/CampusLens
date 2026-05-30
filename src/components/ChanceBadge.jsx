export default function ChanceBadge({ chance }) {
  const config = {
    High: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      dot: 'bg-emerald-500',
      pulse: true,
    },
    Medium: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      pulse: false,
    },
    Low: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-600',
      dot: 'bg-red-500',
      pulse: false,
    },
  };

  const c = config[chance] || config.Low;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${c.bg} ${c.text}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse-dot' : ''}`}
      />
      {chance} Chance
    </span>
  );
}
