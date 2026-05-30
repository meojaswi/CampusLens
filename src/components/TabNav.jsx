export default function TabNav({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200
            ${
              activeTab === tab.id
                ? 'tab-active font-semibold'
                : 'text-muted hover:text-on-surface hover:bg-gray-50'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
