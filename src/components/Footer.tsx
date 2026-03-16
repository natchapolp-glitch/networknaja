export default function Footer() {
  return (
    <footer className="border-t mt-auto py-8 px-4"
      style={{ borderColor: 'var(--border-glass)', background: 'rgba(10, 15, 26, 0.5)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-slate-400">
            <span className="gradient-text font-semibold">Animal-AI Network Simulator</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            CP352005 Networks — Group 14 — Undergraduate Project
          </p>
        </div>
        <div className="text-xs text-slate-600">
          © 2026 KKU Computer Science
        </div>
      </div>
    </footer>
  )
}
