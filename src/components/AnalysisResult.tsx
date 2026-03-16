import { type AnalysisOutput } from '../data/mockResponses'

interface Props {
  result: AnalysisOutput
  useCase: string
}

const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
  CRITICAL: { bg: 'rgba(255, 51, 102, 0.15)', text: '#ff3366', label: 'CRITICAL' },
  HIGH: { bg: 'rgba(255, 107, 53, 0.15)', text: '#ff6b35', label: 'HIGH' },
  MEDIUM: { bg: 'rgba(255, 193, 7, 0.15)', text: '#ffc107', label: 'MEDIUM' },
  LOW: { bg: 'rgba(0, 255, 136, 0.15)', text: '#00ff88', label: 'LOW' },
  BACKGROUND: { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', label: 'BACKGROUND' },
}

const useCaseLabels: Record<string, string> = {
  wildlife: 'Wildlife',
  livestock: 'Livestock',
  companion: 'Companion',
}

export default function AnalysisResult({ result, useCase }: Props) {
  const prio = priorityConfig[result.priority] || priorityConfig.LOW

  return (
    <div className="glass-card animate-slide-up space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-slate-500 mb-1">{useCaseLabels[useCase]} — Semantic Analysis</div>
          <h3 className="text-xl font-bold gradient-text">{result.label}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{ background: prio.bg, color: prio.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: prio.text }} />
          {prio.label}
        </div>
      </div>

      {/* Meaning */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 255, 136, 0.05)', borderLeft: '3px solid #00ff88' }}>
        <div className="text-xs text-slate-500 mb-1 font-medium">Semantic Meaning</div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.meaning}</p>
      </div>

      {/* Confidence */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-medium">Confidence Level</span>
          <span className="text-sm font-bold" style={{ color: result.confidence > 0.8 ? '#00ff88' : result.confidence > 0.6 ? '#ffc107' : '#ff6b35' }}>
            {(result.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{
              width: `${result.confidence * 100}%`,
              background: result.confidence > 0.8
                ? 'linear-gradient(90deg, #00ff88, #00d4ff)'
                : result.confidence > 0.6
                  ? 'linear-gradient(90deg, #ffc107, #ff6b35)'
                  : 'linear-gradient(90deg, #ff6b35, #ff3366)',
            }}
          />
        </div>
      </div>

      {/* Action */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 212, 255, 0.05)', borderLeft: '3px solid #00d4ff' }}>
        <div className="text-xs text-slate-500 mb-1 font-medium">Recommended Action</div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.action}</p>
      </div>

      {/* Raw Features */}
      <div>
        <div className="text-xs text-slate-500 font-medium mb-2">Extracted Features</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result.rawFeatures).map(([key, val]) => (
            <div key={key} className="p-2.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-slate-500 mb-0.5">{key}</div>
              <div className="text-slate-200 font-medium">{String(val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="text-xs text-slate-500 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <span className="font-medium text-slate-400">Analysis Details: </span>
        {result.details}
      </div>
    </div>
  )
}
