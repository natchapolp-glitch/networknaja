interface UseCaseTabsProps {
  activeTab: string
  onChange: (tab: string) => void
}

const tabs = [
  { id: 'wildlife', label: 'Wildlife', color: '#00ff88' },
  { id: 'livestock', label: 'Livestock', color: '#00d4ff' },
  { id: 'companion', label: 'Companion', color: '#ff6b35' },
]

const TabIcon = ({ id, color, active }: { id: string; color: string; active: boolean }) => {
  const fill = active ? color : '#64748b'
  if (id === 'wildlife') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="6"/><path d="M6 4L4 2M18 4l2-2"/><path d="M12 16v4M8 20h8"/>
    </svg>
  )
  if (id === 'livestock') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><line x1="12" y1="12" x2="12" y2="14"/>
    </svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.172C10 3.782 8.884 2.5 7.5 2.5c-1.384 0-2.5 1.282-2.5 2.672C5 8 7.5 10 7.5 10S10 8 10 5.172z"/><path d="M14 5.172C14 3.782 15.116 2.5 16.5 2.5c1.384 0 2.5 1.282 2.5 2.672C19 8 16.5 10 16.5 10S14 8 14 5.172z"/><path d="M12 10c-2 2-4 6-4 8a4 4 0 008 0c0-2-2-6-4-8z"/>
    </svg>
  )
}

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
            <TabIcon id={tab.id} color={tab.color} active={isActive} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
