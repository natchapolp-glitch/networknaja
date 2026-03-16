const teamMembers = [
  { id: '673380036-3', name: 'ณภัทร อรัญพูล', role: 'Engineer', emoji: '⚙️' },
  { id: '673380043-6', name: 'ธนินธร อันทรบุตร', role: 'Tester/QA', emoji: '🧪' },
  { id: '673380061-4', name: 'ศุภกร กรมรินทร์', role: 'Architect', emoji: '📐' },
  { id: '673380267-4', name: 'ณัชพล เพ็งพล', role: 'DevOps', emoji: '🚀' },
  { id: '673380268-2', name: 'ณัฐกรณ์ อินธิสาร', role: 'Specialist', emoji: '🧠' },
]

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
            <span className="text-xl">🎯</span> วัตถุประสงค์การเรียนรู้
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
            <span className="text-xl">👥</span> ทีมงาน — กลุ่ม 14
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {teamMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.id} — {m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🛠️</span> Technology Stack
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
            <span className="text-xl">📚</span> References
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
