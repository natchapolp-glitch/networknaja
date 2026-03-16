import { useState, useRef } from 'react'

interface FileUploadProps {
  useCase: string
  onFileLoaded: (data: Record<string, unknown>, fileName: string, fileType: string) => void
  onSampleLoad: () => void
}

export default function FileUpload({ useCase, onFileLoaded, onSampleLoad }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const acceptMap: Record<string, string> = {
    wildlife: '.csv,.json',
    livestock: '.json',
    companion: '.json,.wav',
  }

  const labelMap: Record<string, string> = {
    wildlife: 'CSV (การเคลื่อนไหว) หรือ JSON (สัญญาณชีวภาพ)',
    livestock: 'JSON (สัญญาณชีวภาพ)',
    companion: 'JSON (เสียง/สัญญาณชีวภาพ) หรือ WAV',
  }

  const handleFile = (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text)
          onFileLoaded(json, file.name, 'json')
        } else if (file.name.endsWith('.csv')) {
          const lines = text.trim().split('\n')
          const headers = lines[0].split(',').map(h => h.trim())
          const rows = lines.slice(1).map(line => {
            const vals = line.split(',')
            const row: Record<string, unknown> = {}
            headers.forEach((h, i) => {
              const v = vals[i]?.trim()
              row[h] = isNaN(Number(v)) ? v : Number(v)
            })
            return row
          })
          onFileLoaded({ rows, headers, total_points: rows.length }, file.name, 'csv')
        } else {
          // For wav or other binary files, pass basic metadata
          onFileLoaded({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          }, file.name, 'wav')
        }
      } catch {
        onFileLoaded({ error: 'ไม่สามารถอ่านไฟล์ได้', fileName: file.name }, file.name, 'unknown')
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <span>📂</span> อัปโหลดข้อมูล
      </h3>

      {/* Drop zone */}
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept={acceptMap[useCase] || '.json,.csv'}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {fileName ? (
          <div className="animate-fade-in">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm text-slate-300 font-medium">{fileName}</div>
            <div className="text-xs text-slate-500 mt-1">คลิกเพื่อเปลี่ยนไฟล์</div>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-3 opacity-50">📁</div>
            <div className="text-sm text-slate-400 mb-1">
              ลากไฟล์มาวางที่นี่ หรือ<span className="text-[#00ff88] font-medium">คลิกเพื่อเลือก</span>
            </div>
            <div className="text-xs text-slate-600">
              รองรับ: {labelMap[useCase]}
            </div>
          </>
        )}
      </div>

      {/* Or use sample */}
      <div className="mt-4 text-center">
        <span className="text-xs text-slate-600">— หรือ —</span>
        <button
          onClick={() => {
            setFileName('sample-data')
            onSampleLoad()
          }}
          className="mt-2 w-full btn-secondary text-xs py-2"
        >
          ⚡ ใช้ข้อมูลตัวอย่าง ({useCase === 'wildlife' ? 'ช้างอพยพ' : useCase === 'livestock' ? 'สัญญาณชีพวัว' : 'เสียงสุนัข'})
        </button>
      </div>
    </div>
  )
}
