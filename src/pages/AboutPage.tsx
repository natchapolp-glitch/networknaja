const teamMembers = [
  { id: '673380036-3', name: 'ณภัทร อรัญพูล', role: 'Engineer', initials: 'NP' },
  { id: '673380043-6', name: 'ธนินธร อันทรบุตร', role: 'Tester/QA', initials: 'TN' },
  { id: '673380061-4', name: 'ศุภกร กรมรินทร์', role: 'Architect', initials: 'SK' },
  { id: '673380267-4', name: 'ณัชพล เพ็งพล', role: 'DevOps', initials: 'NC' },
  { id: '673380268-2', name: 'ณัฐกรณ์ อินธิสาร', role: 'Specialist', initials: 'NK' },
]

const roleColors: Record<string, string> = {
  Engineer: '#00ff88',
  'Tester/QA': '#00d4ff',
  Architect: '#a78bfa',
  DevOps: '#ff6b35',
  Specialist: '#f59e0b',
}

const objectives = [
  'เข้าใจข้อจำกัดของสถาปัตยกรรม TCP/IP กับข้อมูลชีวภาพ',
  'ออกแบบชั้นเครือข่ายใหม่สำหรับการสื่อสารข้ามสายพันธุ์',
  'บูรณาการ AI เข้ากับโครงสร้างพื้นฐานเครือข่ายในทุกชั้น',
  'ประยุกต์แนวคิดเครือข่ายกับงานอนุรักษ์และสวัสดิภาพสัตว์',
]

const references = [
  'Kurose & Ross, "Computer Networking: A Top-Down Approach"',
  'Tanenbaum, "Computer Networks"',
  'OSI Model — ISO/IEC 7498-1',
  'Animal-AI Environment (Unity3D Platform)',
]

export default function AboutPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            เกี่ยวกับ <span className="gradient-text">โปรเจกต์</span>
          </h1>
          <p className="text-slate-400 text-sm">
            CP352005 Networks — Undergraduate Computer Networks Course
          </p>
        </div>

        {/* Project Info */}
        <div className="glass-card mb-8 animate-slide-up">
          <h2 className="text-xl font-bold mb-4 gradient-text">Animal-AI Network</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Animal-AI Network เป็นสถาปัตยกรรมเครือข่ายเชิงแนวคิดที่ช่วยให้สัตว์ ระบบ AI
            และมนุษย์สามารถสื่อสารกันได้ โดยผสานสัญญาณชีวภาพ ข้อมูลพฤติกรรม
            และความเข้าใจเชิงความหมายเข้าไว้ในโครงสร้างเครือข่ายโดยตรง
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            โปรเจกต์นี้แสดงให้เห็นว่า AI สามารถทำหน้าที่เป็น Semantic Interpreter
            ในระดับเครือข่าย แปลงข้อมูลดิบจากเซ็นเซอร์ให้เป็นความหมายที่เข้าใจได้
            และชี้ให้เห็นข้อจำกัดของ Internet Protocol ปัจจุบัน
          </p>
        </div>

        {/* Objectives */}
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            วัตถุประสงค์การเรียนรู้
          </h2>
          <ul className="space-y-3">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: 'rgba(0, 255, 136, 0.15)', color: '#00ff88' }}>
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Team */}
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00d4ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            ทีมงาน — กลุ่ม 14
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {teamMembers.map(m => {
              const color = roleColors[m.role] || '#64748b'
              return (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${color}15`, color }}>
                    {m.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.id} — {m.role}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'React + TS', desc: 'Frontend' },
              { name: 'FastAPI', desc: 'Backend' },
              { name: 'Tailwind', desc: 'Styling' },
              { name: 'librosa', desc: 'Audio AI' },
              { name: 'scikit-learn', desc: 'ML' },
              { name: 'Chart.js', desc: 'Charts' },
              { name: 'Vite', desc: 'Build tool' },
              { name: 'Python', desc: 'Language' },
            ].map((t, i) => (
              <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-sm font-semibold text-slate-200">{t.name}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* References */}
        <div className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            References
          </h2>
          <ul className="space-y-2">
            {references.map((ref, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-slate-600 mt-0.5">•</span>
                {ref}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
