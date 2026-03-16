import { Link } from 'react-router-dom'

const UseCaseIcon = ({ id, color }: { id: string; color: string }) => {
  if (id === 'wildlife') return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="6"/><path d="M6 4L4 2M18 4l2-2"/><path d="M12 16v4M8 20h8"/>
    </svg>
  )
  if (id === 'livestock') return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2"/><line x1="12" y1="12" x2="12" y2="14"/>
    </svg>
  )
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5.172C10 3.782 8.884 2.5 7.5 2.5c-1.384 0-2.5 1.282-2.5 2.672C5 8 7.5 10 7.5 10S10 8 10 5.172z"/><path d="M14 5.172C14 3.782 15.116 2.5 16.5 2.5c1.384 0 2.5 1.282 2.5 2.672C19 8 16.5 10 16.5 10S14 8 14 5.172z"/><path d="M12 10c-2 2-4 6-4 8a4 4 0 008 0c0-2-2-6-4-8z"/>
    </svg>
  )
}

const useCases = [
  {
    id: 'wildlife',
    title: 'Wildlife Communication',
    desc: 'ตรวจจับสัญญาณเตือนภัย วิเคราะห์การอพยพ และติดตามสุขภาพสัตว์ป่า',
    color: '#00ff88',
    bg: 'from-green-500/10 to-emerald-500/5',
  },
  {
    id: 'livestock',
    title: 'Smart Livestock',
    desc: 'ตรวจสอบสัญญาณชีวภาพ วิเคราะห์ความเครียด และจัดการฟาร์มอัจฉริยะ',
    color: '#00d4ff',
    bg: 'from-blue-500/10 to-cyan-500/5',
  },
  {
    id: 'companion',
    title: 'Companion Animal',
    desc: 'แปลภาษาสัตว์เลี้ยง วิเคราะห์อารมณ์ และดูแลสุขภาพเบื้องต้น',
    color: '#ff6b35',
    bg: 'from-orange-500/10 to-amber-500/5',
  },
]

const stats = [
  { value: '5', label: 'Network Layers' },
  { value: '3', label: 'Use Cases' },
  { value: '4', label: 'Protocols' },
  { value: '∞', label: 'Possibilities' },
]

const layers = [
  { name: 'Semantic Application', color: '#00ff88' },
  { name: 'Context-Aware Transport', color: '#00d4ff' },
  { name: 'AI-Native Network', color: '#a78bfa' },
  { name: 'Bio-Signal Link', color: '#f59e0b' },
  { name: 'Biological Physical', color: '#ff6b35' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Animated bg particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float"
              style={{
                width: `${8 + i * 4}px`,
                height: `${8 + i * 4}px`,
                background: i % 2 === 0 ? '#00ff88' : '#00d4ff',
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 animate-fade-in"
            style={{ borderColor: 'var(--border-glass)', background: 'rgba(0, 255, 136, 0.05)' }}>
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
            <span className="text-xs text-slate-400">CP352005 Networks — Group 14</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
            <span className="gradient-text">Animal-AI</span>
            <br />
            <span className="text-white">Network Simulator</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 animate-slide-up leading-relaxed"
            style={{ animationDelay: '0.15s' }}>
            AI เป็นตัวกลางแปลสัญญาณชีวภาพของสัตว์ให้เป็นความหมายเชิง Semantic
            <br className="hidden md:inline" />
            ชี้ข้อจำกัดของ TCP/IP และนำเสนอสถาปัตยกรรมเครือข่ายทางเลือก
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
            style={{ animationDelay: '0.3s' }}>
            <Link to="/simulator" className="btn-primary text-base px-8 py-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              ลองใช้ Simulator
            </Link>
            <Link to="/about" className="btn-secondary text-base px-8 py-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              เกี่ยวกับโปรเจกต์
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.45s' }}>
            {stats.map((s, i) => (
              <div key={i} className="glass-card py-4 px-3">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Layer Architecture Preview */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            สถาปัตยกรรม <span className="gradient-text">5 ชั้น</span>
          </h2>
          <p className="text-slate-400 text-center mb-10 text-sm">
            ออกแบบเพื่อรองรับการสื่อสารข้ามสายพันธุ์ด้วย AI
          </p>
          <div className="max-w-lg mx-auto space-y-2">
            {layers.map((layer, i) => (
              <div
                key={i}
                className="glass-card py-3 px-5 flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: `${layer.color}20`, color: layer.color }}>
                  L{5 - i}
                </div>
                <span className="text-sm font-medium">{layer.name}</span>
                <div className="ml-auto w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${100 - i * 12}%`, background: layer.color, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Use Cases */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            3 <span className="gradient-text">Use Cases</span>
          </h2>
          <p className="text-slate-400 text-center mb-10 text-sm">
            สาธิตการทำงานของ AI Semantic Interpreter ผ่าน 3 กรณีศึกษา
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <Link
                key={uc.id}
                to={`/simulator?tab=${uc.id}`}
                className={`glass-card group animate-slide-up bg-gradient-to-br ${uc.bg} hover:scale-[1.02]`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="mb-4"><UseCaseIcon id={uc.id} color={uc.color} /></div>
                <h3 className="text-lg font-bold mb-2" style={{ color: uc.color }}>
                  {uc.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{uc.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium"
                  style={{ color: uc.color }}>
                  ลองใช้งาน
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
