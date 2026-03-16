interface Props {
  activeLayer?: number
}

const layerProcessing: Record<number, { input: string; output: string; process: string }> = {
  4: { input: 'Raw sensor data (binary)', process: 'Signal acquisition → noise reduction', output: 'Clean bio-signal stream' },
  3: { input: 'Clean bio-signal stream', process: 'Frame creation → checksum → sync', output: 'Bio-Frame (structured)' },
  2: { input: 'Bio-Frame', process: 'Bio-Address resolution → Semantic routing', output: 'Routed packet + priority' },
  1: { input: 'Routed packet', process: 'Priority queue → adaptive reliability', output: 'Reliable delivery' },
  0: { input: 'Delivered data', process: 'Semantic interpretation → action mapping', output: 'Meaningful insight + action' },
}

export default function LayerDiagram({ activeLayer = -1 }: Props) {
  const info = activeLayer >= 0 ? layerProcessing[activeLayer] : null

  return (
    <div className="glass-card animate-slide-up">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        Layer Processing Detail
      </h3>

      {info ? (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-[#ff6b35]/10 text-[#ff6b35] font-mono">Input</span>
            <span className="text-slate-400">{info.input}</span>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-4 h-6 text-slate-600" fill="none" viewBox="0 0 16 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4v16m0 0l-4-4m4 4l4-4" />
            </svg>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(167, 139, 250, 0.08)' }}>
            <div className="text-[10px] text-slate-500 mb-1">Processing</div>
            <div className="text-xs text-[#a78bfa] font-medium">{info.process}</div>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-4 h-6 text-slate-600" fill="none" viewBox="0 0 16 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4v16m0 0l-4-4m4 4l4-4" />
            </svg>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-[#00ff88]/10 text-[#00ff88] font-mono">Output</span>
            <span className="text-slate-400">{info.output}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-600">
          <svg className="w-8 h-8 mx-auto mb-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Run analysis to see layer processing
        </div>
      )}
    </div>
  )
}
