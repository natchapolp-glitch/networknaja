interface UseCaseTabsProps {
  activeTab: string
  onChange: (tab: string) => void
}

const tabs = [
  { id: 'wildlife', icon: '🦁', label: 'Wildlife', color: '#00ff88' },
  { id: 'livestock', icon: '🐄', label: 'Livestock', color: '#00d4ff' },
  { id: 'companion', icon: '🐕', label: 'Companion', color: '#ff6b35' },
]

export default function UseCaseTabs({ activeTab, onChange }: UseCaseTabsProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
              isActive
                ? 'text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            style={isActive ? {
              background: `${tab.color}15`,
              boxShadow: `0 0 20px ${tab.color}20`,
              color: tab.color,
            } : {}}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
