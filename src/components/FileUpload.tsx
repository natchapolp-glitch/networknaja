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

  const sampleLabelMap: Record<string, string> = {
    wildlife: 'Elephant Migration',
    livestock: 'Cow Vital Signs',
    companion: 'Dog Bark Audio',
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
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
        </svg>
        Upload Data
      </h3>

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
            <svg className="w-8 h-8 mx-auto mb-2 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className="text-sm text-slate-300 font-medium">{fileName}</div>
            <div className="text-xs text-slate-500 mt-1">Click to change file</div>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <div className="text-sm text-slate-400 mb-1">
              Drag file here or <span className="text-[#00ff88] font-medium">browse</span>
            </div>
            <div className="text-xs text-slate-600">
              Accepts: {labelMap[useCase]}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-slate-600">— or —</span>
        <button
          onClick={() => {
            setFileName('sample-data')
            onSampleLoad()
          }}
          className="mt-2 w-full btn-secondary text-xs py-2 flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Use Sample Data ({sampleLabelMap[useCase]})
        </button>
      </div>
    </div>
  )
}
