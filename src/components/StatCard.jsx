export default function StatCard({ label, value, icon }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      {icon && (
        <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center text-xl shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-bold text-on-surface leading-tight">{value}</p>
      </div>
    </div>
  );
}
