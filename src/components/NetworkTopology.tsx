import { useEffect, useState } from 'react'

const layers = [
  { name: 'L5: Semantic Application', color: '#00ff88', desc: 'Wildlife Monitor / Livestock Manager / Pet Translator' },
  { name: 'L4: Context-Aware Transport', color: '#00d4ff', desc: 'Priority Management, Adaptive Reliability' },
  { name: 'L3: AI-Native Network', color: '#a78bfa', desc: 'Bio-Addressing, Semantic Routing Protocol' },
  { name: 'L2: Bio-Signal Link', color: '#f59e0b', desc: 'Bio-Frame Format, Signal Synchronization' },
  { name: 'L1: Biological Physical', color: '#ff6b35', desc: 'Sensors, Wearables, Bio-signal Acquisition' },
]

interface Props {
  isProcessing?: boolean
  activeLayer?: number
}

export default function NetworkTopology({ isProcessing = false, activeLayer = -1 }: Props) {
  const [currentLayer, setCurrentLayer] = useState(-1)
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    if (!isProcessing) {
      setCurrentLayer(-1)
      setParticles([])
      return
    }
    let layer = 4
    setCurrentLayer(layer)
    const interval = setInterval(() => {
      layer--
      if (layer < 0) layer = 4
      setCurrentLayer(layer)
      setParticles(prev => [...prev, Date.now()].slice(-5))
    }, 800)
    return () => clearInterval(interval)
  }, [isProcessing])

  const displayLayer = activeLayer >= 0 ? activeLayer : currentLayer

  return (
    <div className="glass-card animate-slide-up">
      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
        </svg>
        Network Layer Architecture
        {isProcessing && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00ff88]/10 text-[#00ff88] animate-pulse ml-auto">
            Processing
          </span>
        )}
      </h3>

      <div className="relative space-y-1.5">
        {isProcessing && (
          <div className="absolute left-6 top-0 bottom-0 w-0.5 opacity-30"
            style={{ background: 'linear-gradient(to top, #ff6b35, #00ff88)' }}>
            {particles.map((id) => (
              <div key={id} className="absolute w-2 h-2 rounded-full -left-[3px] data-particle"
                style={{ background: '#00ff88', top: '100%' }} />
            ))}
          </div>
        )}

        {layers.map((layer, i) => {
          const isActive = displayLayer === i
          return (
            <div key={i}
              className="relative flex items-center gap-3 p-3 rounded-xl transition-all duration-500"
              style={{
                background: isActive ? `${layer.color}10` : 'rgba(255,255,255,0.02)',
                borderLeft: isActive ? `3px solid ${layer.color}` : '3px solid transparent',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? `0 0 20px ${layer.color}15` : 'none',
              }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
                style={{
                  background: isActive ? `${layer.color}25` : 'rgba(255,255,255,0.05)',
                  color: isActive ? layer.color : '#64748b',
                }}>
                {isActive && <span className="absolute w-10 h-10 rounded-lg animate-ping opacity-20" style={{ background: layer.color }} />}
                L{5 - i}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: isActive ? layer.color : '#cbd5e1' }}>
                  {layer.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{layer.desc}</div>
              </div>
              <div className="ml-auto flex-shrink-0">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: isActive ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#a78bfa' : '#475569',
                  }}>
                  AI
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t flex items-center justify-center gap-4 text-[10px] text-slate-600"
        style={{ borderColor: 'var(--border-glass)' }}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> Active
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#a78bfa]" /> AI Embedded
        </span>
      </div>
    </div>
  )
}
