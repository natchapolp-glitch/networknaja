import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import UseCaseTabs from '../components/UseCaseTabs'
import FileUpload from '../components/FileUpload'
import AnalysisResult from '../components/AnalysisResult'
import ComparisonView from '../components/ComparisonView'
import NetworkTopology from '../components/NetworkTopology'
import LayerDiagram from '../components/LayerDiagram'
import ConfidenceChart from '../components/ConfidenceChart'
import { sampleData, mockResults, type AnalysisOutput } from '../data/mockResponses'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function SimulatorPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'companion')
  const [result, setResult] = useState<AnalysisOutput | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeLayer, setActiveLayer] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  // Reset when tab changes
  useEffect(() => {
    setResult(null)
    setError(null)
    setIsProcessing(false)
    setActiveLayer(-1)
  }, [activeTab])

  const simulateLayerProcessing = (callback: () => void) => {
    setIsProcessing(true)
    setActiveLayer(4) // Start from bottom layer

    const layerTimings = [4, 3, 2, 1, 0]
    layerTimings.forEach((layer, i) => {
      setTimeout(() => {
        setActiveLayer(layer)
      }, (i + 1) * 600)
    })

    // Complete after all layers
    setTimeout(() => {
      setIsProcessing(false)
      setActiveLayer(0)
      callback()
    }, layerTimings.length * 600 + 300)
  }

  const analyzeWithBackend = async (data: Record<string, unknown>, fileName: string, fileType: string) => {
    setError(null)

    simulateLayerProcessing(() => {
      // Try backend first, fall back to mock
      const fetchAnalysis = async () => {
        try {
          const response = await fetch(`${API_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              use_case: activeTab,
              data_type: fileType,
              file_name: fileName,
              data: data,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            setResult(result)
            return
          }
        } catch {
          // Backend not available, use local analysis
        }

        // If real audio data, analyze from actual features
        if (data.source === 'real_audio') {
          setResult(analyzeRealAudio(data, activeTab))
          return
        }

        // Fallback to mock results
        const mockKey = getMockKey(activeTab, fileType)
        if (mockKey && mockResults[mockKey]) {
          setResult(mockResults[mockKey])
        } else {
          setResult(generateGenericResult(data, activeTab))
        }
      }

      fetchAnalysis()
    })
  }

  const loadSampleData = () => {
    const sampleKey = getSampleKey(activeTab)
    const sample = sampleData[sampleKey]
    if (sample) {
      const mockKey = sampleKey
      simulateLayerProcessing(() => {
        setResult(mockResults[mockKey] || generateGenericResult(sample.data, activeTab))
      })
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="gradient-text">Network Simulator</span>
          </h1>
          <p className="text-sm text-slate-400">
            อัปโหลดข้อมูลจำลอง → AI แปลเป็น Semantic Meaning → ดูผลวิเคราะห์
          </p>
        </div>

        {/* Use Case Tabs */}
        <div className="max-w-md mx-auto mb-8">
          <UseCaseTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FileUpload
              useCase={activeTab}
              onFileLoaded={analyzeWithBackend}
              onSampleLoad={loadSampleData}
            />
            <NetworkTopology isProcessing={isProcessing} activeLayer={activeLayer} />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-1 space-y-6">
            {isProcessing && (
              <div className="glass-card animate-fade-in">
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="w-5 h-5 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-slate-400">กำลังวิเคราะห์ผ่าน 5 ชั้นเครือข่าย...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="glass-card border-[#ff3366]/30 animate-fade-in">
                <p className="text-sm text-[#ff3366] flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {error}
                </p>
              </div>
            )}

            {result && !isProcessing && (
              <AnalysisResult result={result} useCase={activeTab} />
            )}

            {!result && !isProcessing && (
              <div className="glass-card text-center py-16">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <p className="text-sm text-slate-500">
                  Upload data or use sample data<br />to start analysis
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {result && !isProcessing && (
              <ConfidenceChart confidence={result.confidence} label={result.label} />
            )}
            <LayerDiagram activeLayer={activeLayer} />
          </div>
        </div>

        {/* Comparison View - Full Width */}
        <div className="mt-8">
          <ComparisonView />
        </div>
      </div>
    </div>
  )
}

// ========= Helper Functions =========

function getSampleKey(useCase: string): string {
  switch (useCase) {
    case 'wildlife': return 'wildlife_movement'
    case 'livestock': return 'livestock_biosignal'
    case 'companion': return 'companion_sound'
    default: return 'companion_sound'
  }
}

function getMockKey(useCase: string, fileType: string): string | null {
  if (useCase === 'companion' && (fileType === 'wav' || fileType === 'json')) return 'companion_sound'
  if (useCase === 'wildlife' && fileType === 'csv') return 'wildlife_movement'
  if (useCase === 'wildlife' && fileType === 'json') return 'wildlife_biosignal'
  if (useCase === 'livestock') return 'livestock_biosignal'
  if (useCase === 'companion' && fileType === 'json') return 'companion_biosignal'
  return null
}

function generateGenericResult(data: Record<string, unknown>, useCase: string): AnalysisOutput {
  const hasHighValues = Object.values(data).some(v => typeof v === 'number' && v > 50)

  return {
    meaning: `ระบบตรวจพบข้อมูลจาก ${useCase} — วิเคราะห์ pattern เบื้องต้นแล้ว`,
    label: hasHighValues ? 'Elevated Activity' : 'Normal Activity',
    confidence: hasHighValues ? 0.72 : 0.65,
    action: hasHighValues
      ? 'ค่าบางตัวสูงกว่าปกติ ควรติดตามเพิ่มเติม'
      : 'ค่าทั้งหมดอยู่ในเกณฑ์ปกติ ไม่ต้องดำเนินการ',
    priority: hasHighValues ? 'MEDIUM' : 'LOW',
    rawFeatures: Object.fromEntries(
      Object.entries(data)
        .filter(([, v]) => typeof v === 'number' || typeof v === 'string')
        .slice(0, 6)
        .map(([k, v]) => [k, v as number | string])
    ),
    details: `วิเคราะห์จากข้อมูล ${Object.keys(data).length} features — ใช้ rule-based interpretation`,
  }
}

function analyzeRealAudio(data: Record<string, unknown>, useCase: string): AnalysisOutput {
  const energy = (data.energy as number) || 0
  const pitch = (data.pitch as number) || 0
  const duration = (data.duration as number) || 0
  const pattern = (data.pattern as string) || 'unknown'
  const spectralCentroid = (data.spectral_centroid as number) || 0
  const peakAmplitude = (data.peak_amplitude as number) || 0

  // Determine emotional state based on audio features
  let label = ''
  let meaning = ''
  let action = ''
  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BACKGROUND' = 'LOW'
  let confidence = 0.65

  // High energy + high pitch = distress or excitement
  // Low energy + low pitch = calm or sleep
  // Repeated pattern = calling / alert
  // Sustained = distress or territorial

  if (energy > 0.7 && pitch > 1500 && pattern === 'repeated_short') {
    label = 'Alert / Distress Call'
    meaning = `ตรวจพบเสียงร้องแบบซ้ำ ๆ พลังงานสูง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — บ่งบอกถึงสัญญาณเตือนภัยหรือขอความช่วยเหลือ`
    action = 'ควรตรวจสอบสภาพแวดล้อมของสัตว์ทันที อาจมีอันตรายหรือความเครียด'
    priority = 'HIGH'
    confidence = 0.82
  } else if (energy > 0.7 && pitch > 1000 && (pattern === 'varied' || pattern === 'sustained')) {
    label = 'Excited / Active Communication'
    meaning = `เสียงพลังงานสูง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz รูปแบบ ${pattern} — สัตว์กำลังสื่อสารอย่างกระตือรือร้น อาจเป็นการเรียก ตอบสนอง หรือแสดงอาณาเขต`
    action = 'เสียงแสดงความกระตือรือร้น ติดตามพฤติกรรมต่อเพื่อประเมินว่าเป็นปกติหรือไม่'
    priority = 'MEDIUM'
    confidence = 0.78
  } else if (energy > 0.5 && pitch > 800 && pattern === 'repeated_short') {
    label = 'Routine Vocalization'
    meaning = `เสียงร้องปกติ พลังงาน ${energy.toFixed(2)} ความถี่ ${pitch} Hz — เป็นการสื่อสารทั่วไปในชีวิตประจำวัน เช่น เรียกหาอาหาร เรียกฝูง`
    action = 'อยู่ในเกณฑ์ปกติ ไม่ต้องดำเนินการใด ๆ'
    priority = 'LOW'
    confidence = 0.75
  } else if (energy > 0.6 && pattern === 'single_burst') {
    label = 'Startle / Warning'
    meaning = `เสียงสั้นพลังงานสูง (${energy.toFixed(2)}) — อาจเป็นปฏิกิริยาตกใจ หรือเสียงเตือนเบื้องต้น`
    action = 'ตรวจสอบสาเหตุที่ทำให้ตกใจ อาจมีสิ่งรบกวนในสภาพแวดล้อม'
    priority = 'MEDIUM'
    confidence = 0.70
  } else if (energy < 0.3 && pattern === 'sustained') {
    label = 'Resting / Content'
    meaning = `เสียงเบาต่อเนื่อง พลังงาน ${energy.toFixed(2)} — สัตว์อยู่ในสภาวะสงบ พักผ่อน หรือพึงพอใจ`
    action = 'สัตว์อยู่ในสภาพดี ไม่ต้องดำเนินการ'
    priority = 'BACKGROUND'
    confidence = 0.72
  } else if (energy > 0.5) {
    label = 'Active Vocalization'
    meaning = `ตรวจพบเสียงร้องพลังงาน ${energy.toFixed(2)} ความถี่หลัก ${pitch} Hz ระยะเวลา ${duration.toFixed(1)}s — สัตว์กำลังสื่อสารหรือตอบสนองต่อสิ่งเร้า`
    action = 'ติดตามเพิ่มเติม ดูว่าเป็นรูปแบบพฤติกรรมปกติหรือไม่'
    priority = 'LOW'
    confidence = 0.68
  } else {
    label = 'Low Activity / Background'
    meaning = `เสียงพลังงานต่ำ (${energy.toFixed(2)}) — อาจเป็นเสียงพื้นหลัง หรือสัตว์อยู่ในช่วงพักผ่อน`
    action = 'ไม่มีสัญญาณผิดปกติ'
    priority = 'BACKGROUND'
    confidence = 0.60
  }

  // Adjust confidence based on spectral centroid clarity
  if (spectralCentroid > 3000) confidence = Math.min(confidence + 0.05, 0.95)
  if (peakAmplitude > 0.9) confidence = Math.min(confidence + 0.03, 0.95)

  // Add use case context
  const useCaseContextMap: Record<string, string> = {
    wildlife: 'สัตว์',
    livestock: 'สัตว์',
    companion: 'สัตว์',
  }
  const useCaseLabel = useCaseContextMap[useCase] || useCase

  return {
    meaning: `[${useCaseLabel}] ${meaning}`,
    label,
    confidence,
    action,
    priority,
    rawFeatures: {
      avg_energy: energy,
      pitch_hz: pitch,
      duration_sec: duration,
      sound_pattern: pattern,
      spectral_centroid: spectralCentroid,
      peak_amplitude: peakAmplitude,
    },
    details: `วิเคราะห์จากไฟล์เสียงจริง "${data.file_name}" — ดึง features ด้วย Web Audio API แล้วตีความด้วย rule-based semantic interpreter`,
  }
}
