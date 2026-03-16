const tcpLimitations = [
  {
    icon: '📦',
    title: 'ส่งได้แค่ Bytes',
    desc: 'TCP/IP ส่งข้อมูลเป็น byte stream ดิบ ไม่เข้าใจความหมายของข้อมูลที่ส่ง',
    hex: '48 65 6C 6C 6F 20 57 6F 72 6C 64 2E 2E',
  },
  {
    icon: '🏷️',
    title: 'IP Address ไม่รองรับ Biological Identity',
    desc: 'ที่อยู่ IP ระบุแค่ตำแหน่งเครือข่าย ไม่สามารถระบุสายพันธุ์หรือตัวตนทางชีวภาพได้',
    hex: '192.168.1.42 → ??? (species? individual?)',
  },
  {
    icon: '🎯',
    title: 'TCP ไม่รองรับ Uncertainty',
    desc: 'ข้อมูลชีวภาพมี uncertainty เสมอ แต่ TCP ไม่มีกลไกส่งค่า confidence ไปกับ packet',
    hex: 'ACK / NACK → no confidence level',
  },
  {
    icon: '⚖️',
    title: 'ไม่มี Priority ตาม Context',
    desc: 'TCP ไม่แยกแยะว่าข้อมูลเป็น distress signal หรือ routine data ทุก packet เท่าเทียมกัน',
    hex: 'All packets → same queue (FIFO)',
  },
]

const aiSolutions = [
  {
    icon: '🧠',
    title: 'AI แปลเป็น Semantic Meaning',
    desc: 'AI Semantic Interpreter แปลสัญญาณดิบเป็นความหมายที่เข้าใจได้ทันที',
    example: '"ความเครียดสูง — cortisol 18.5 ng/ml"',
    color: '#00ff88',
  },
  {
    icon: '🧬',
    title: 'Bio-Address ระบุตัวตนชีวภาพ',
    desc: 'ที่อยู่แบบ hierarchical taxonomy ระบุ species, breed, individual ID',
    example: 'MAM.CAN.LAB.#0847 (สุนัข ลาบราดอร์ ตัวที่ 847)',
    color: '#00d4ff',
  },
  {
    icon: '📊',
    title: 'ส่ง Confidence ไปกับข้อมูล',
    desc: 'ทุก packet มี confidence level เพื่อให้ปลายทางตัดสินใจได้อย่างเหมาะสม',
    example: 'confidence: 0.87 ± 0.05',
    color: '#a78bfa',
  },
  {
    icon: '🚨',
    title: 'Semantic Routing จัดลำดับ Priority',
    desc: 'จัดลำดับอัตโนมัติตาม context — distress signal ส่งก่อน routine data',
    example: 'CRITICAL → HIGH → MEDIUM → LOW',
    color: '#ff6b35',
  },
]

export default function ComparisonView() {
  return (
    <div className="glass-card animate-slide-up">
      <h3 className="text-lg font-bold mb-2 text-center">
        <span className="gradient-text-warm">TCP/IP</span>
        <span className="text-slate-500 mx-3">vs</span>
        <span className="gradient-text">Animal-AI Network</span>
      </h3>
      <p className="text-xs text-slate-500 text-center mb-6">
        ข้อจำกัดของโปรโตคอลปัจจุบัน เทียบกับสถาปัตยกรรมที่เข้าใจชีวภาพ
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* TCP/IP Side */}
        <div>
          <div className="text-xs font-bold text-[#ff3366] mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
            ข้อจำกัด TCP/IP
          </div>
          <div className="space-y-3">
            {tcpLimitations.map((item, i) => (
              <div key={i} className="panel-tcp p-3 rounded-lg" style={{ background: 'rgba(255, 51, 102, 0.03)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{item.title}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <code className="text-[10px] text-[#ff6b6b] bg-black/30 px-2 py-1 rounded block font-mono">
                  {item.hex}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* AI Network Side */}
        <div>
          <div className="text-xs font-bold text-[#00ff88] mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            Animal-AI Network
          </div>
          <div className="space-y-3">
            {aiSolutions.map((item, i) => (
              <div key={i} className="panel-ai p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.03)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{item.title}</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{item.desc}</p>
                <code className="text-[10px] px-2 py-1 rounded block font-mono" style={{ color: item.color, background: 'rgba(0,0,0,0.3)' }}>
                  {item.example}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-xl text-center" style={{ background: 'rgba(0, 255, 136, 0.05)' }}>
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-semibold text-slate-300">สรุป:</span> Internet Protocol ปัจจุบันไม่เข้าใจ context ทางชีวภาพ
          — Animal-AI Network ใช้ AI เป็น <span className="text-[#00ff88] font-semibold">Semantic Interpreter</span> แปลงข้อมูลดิบให้เป็นความหมายที่มนุษย์และระบบเข้าใจได้
        </p>
      </div>
    </div>
  )
}
