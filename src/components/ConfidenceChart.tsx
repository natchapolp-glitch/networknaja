import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  confidence: number
  label: string
}

export default function ConfidenceChart({ confidence, label }: Props) {
  const pct = Math.round(confidence * 100)
  const color = confidence > 0.8 ? '#00ff88' : confidence > 0.6 ? '#ffc107' : '#ff6b35'

  const data = {
    labels: ['Confidence', 'Uncertainty'],
    datasets: [
      {
        data: [pct, 100 - pct],
        backgroundColor: [color, 'rgba(255, 255, 255, 0.05)'],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 0,
        cutout: '78%',
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }

  return (
    <div className="glass-card animate-slide-up">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <span>📊</span> Confidence Score
      </h3>
      <div className="relative w-40 h-40 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{pct}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  )
}
