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
import { analyzeMovementData } from '../utils/movementAnalyzer'
import { analyzeBiosignalData, isBiosignalData } from '../utils/biosignalAnalyzer'

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

        // If movement data (CSV), analyze with movement analyzer
        if (fileType === 'csv' || data.rows || data.path) {
          setResult(analyzeMovementData(data as Record<string, unknown>))
          return
        }

        // If biosignal data (JSON with vital signs), analyze with biosignal analyzer
        if (isBiosignalData(data)) {
          setResult(analyzeBiosignalData(data as Record<string, unknown>, activeTab))
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
      simulateLayerProcessing(() => {
        // Use real analyzers for sample data too
        if (sample.type === 'movement') {
          setResult(analyzeMovementData(sample.data as Record<string, unknown>))
        } else if (sample.type === 'biosignal') {
          setResult(analyzeBiosignalData(sample.data as Record<string, unknown>, activeTab))
        } else {
          // Sound / other — use mock
          setResult(mockResults[sampleKey] || generateGenericResult(sample.data, activeTab))
        }
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
              key={activeTab}
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

  // Branch to use-case-specific interpreter
  if (useCase === 'wildlife') {
    return analyzeWildlifeAudio(energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
  } else if (useCase === 'livestock') {
    return analyzeLivestockAudio(energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
  } else {
    return analyzeCompanionAudio(energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
  }
}

// ========= Wildlife: เน้น alert / territorial / migration / environmental threat =========
function analyzeWildlifeAudio(
  energy: number, pitch: number, duration: number, pattern: string,
  spectralCentroid: number, peakAmplitude: number, data: Record<string, unknown>
): AnalysisOutput {
  let label = '', meaning = '', action = ''
  let priority: AnalysisOutput['priority'] = 'LOW'
  let confidence = 0.65

  if (energy > 0.7 && pitch > 1500 && pattern === 'repeated_short') {
    label = 'Alarm Call / Predator Alert'
    meaning = `ตรวจพบเสียงเตือนภัยซ้ำ ๆ พลังงานสูง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — สัตว์กำลังส่งสัญญาณเตือนฝูงว่ามีภัยคุกคาม`
    action = '🚨 แจ้งเจ้าหน้าที่พิทักษ์ป่าทันที ตรวจสอบว่ามีผู้ลักลอบล่าสัตว์หรือผู้บุกรุกหรือไม่'
    priority = 'CRITICAL'
    confidence = 0.85
  } else if (energy > 0.7 && pitch > 1000 && pattern === 'sustained') {
    label = 'Territorial Defense'
    meaning = `เสียงร้องต่อเนื่องพลังงานสูง (${energy.toFixed(2)}) — สัตว์กำลังประกาศ/ปกป้องอาณาเขต อาจมีสัตว์อื่นบุกรุก`
    action = '🗺️ ตรวจสอบขอบเขตอาณาเขต เฝ้าระวังความขัดแย้งระหว่างสัตว์'
    priority = 'HIGH'
    confidence = 0.80
  } else if (energy > 0.5 && pitch > 800 && pattern === 'repeated_short') {
    label = 'Group Coordination Call'
    meaning = `เสียงร้องซ้ำ ๆ ระดับปานกลาง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — สัตว์กำลังประสานงานกับฝูง อาจเป็นสัญญาณนำทางหรือเรียกรวมกลุ่ม`
    action = '📡 บันทึกพิกัดและทิศทาง อาจเป็นสัญญาณเริ่มต้นการอพยพ'
    priority = 'MEDIUM'
    confidence = 0.75
  } else if (energy > 0.5 && pattern === 'varied') {
    label = 'Mating / Social Call'
    meaning = `เสียงร้องหลากหลายรูปแบบ พลังงาน ${energy.toFixed(2)} — อาจเป็นพฤติกรรมในฤดูผสมพันธุ์หรือการสื่อสารทางสังคม`
    action = '🌿 พฤติกรรมปกติตามฤดูกาล ติดตามช่วงเวลาเพื่อยืนยัน'
    priority = 'LOW'
    confidence = 0.72
  } else if (energy > 0.6 && pattern === 'single_burst') {
    label = 'Startle Response'
    meaning = `เสียงสั้นพลังงานสูง (${energy.toFixed(2)}) — ปฏิกิริยาตกใจจากภัยคุกคามเฉียบพลัน`
    action = '⚠️ ตรวจสอบสภาพแวดล้อมรอบจุดตรวจจับ อาจมีการรบกวนจากมนุษย์'
    priority = 'MEDIUM'
    confidence = 0.70
  } else if (energy < 0.3 && pattern === 'sustained') {
    label = 'Ambient / Resting'
    meaning = `เสียงเบาต่อเนื่อง (${energy.toFixed(2)}) — สัตว์อาจอยู่ในช่วงพักผ่อนหรือเป็นเสียงสภาพแวดล้อม`
    action = '😴 ไม่มีภัยคุกคาม สัตว์อยู่ในสภาวะสงบ'
    priority = 'BACKGROUND'
    confidence = 0.68
  } else if (energy > 0.5) {
    label = 'Unclassified Vocalization'
    meaning = `ตรวจพบเสียงร้องพลังงาน ${energy.toFixed(2)} ความถี่ ${pitch} Hz — ยังไม่สามารถจำแนกพฤติกรรมได้ชัดเจน`
    action = '📊 บันทึกข้อมูลเพื่อเทียบกับฐานข้อมูลเสียงสัตว์ป่า'
    priority = 'LOW'
    confidence = 0.60
  } else {
    label = 'Low Activity / Background Noise'
    meaning = `เสียงพลังงานต่ำ (${energy.toFixed(2)}) — เป็นเสียงพื้นหลังของป่า ไม่มีสัญญาณจากสัตว์`
    action = 'ไม่มีสัญญาณผิดปกติ'
    priority = 'BACKGROUND'
    confidence = 0.55
  }

  if (spectralCentroid > 3000) confidence = Math.min(confidence + 0.05, 0.95)
  if (peakAmplitude > 0.9) confidence = Math.min(confidence + 0.03, 0.95)

  return buildAudioResult('[สัตว์]', label, meaning, action, priority, confidence, energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
}

// ========= Livestock: เน้น health / heat stress / pain / feeding behavior =========
function analyzeLivestockAudio(
  energy: number, pitch: number, duration: number, pattern: string,
  spectralCentroid: number, peakAmplitude: number, data: Record<string, unknown>
): AnalysisOutput {
  let label = '', meaning = '', action = ''
  let priority: AnalysisOutput['priority'] = 'LOW'
  let confidence = 0.65

  if (energy > 0.7 && pitch > 1500 && pattern === 'repeated_short') {
    label = 'Pain / Distress Vocalization'
    meaning = `เสียงร้องซ้ำ ๆ ความถี่สูง ${pitch} Hz พลังงานสูง (${energy.toFixed(2)}) — สัตว์อาจเจ็บปวด บาดเจ็บ หรือมีปัญหาสุขภาพเฉียบพลัน`
    action = '🩺 ตรวจสอบสัตว์โดยสัตวแพทย์ทันที อาจมีอาการบาดเจ็บหรือโรค'
    priority = 'CRITICAL'
    confidence = 0.85
  } else if (energy > 0.7 && pitch > 1000 && pattern === 'sustained') {
    label = 'Heat Stress Vocalization'
    meaning = `เสียงร้องต่อเนื่องพลังงานสูง (${energy.toFixed(2)}) — สัตว์อาจมีภาวะเครียดจากความร้อน (heat stress) ต้องการลดอุณหภูมิ`
    action = '🚿 ลดอุณหภูมิในคอกทันที เปิดพัดลม/สเปรย์น้ำ ให้น้ำเย็นเพิ่ม'
    priority = 'HIGH'
    confidence = 0.82
  } else if (energy > 0.5 && pitch > 800 && pattern === 'repeated_short') {
    label = 'Hunger / Feeding Request'
    meaning = `เสียงร้องซ้ำ ๆ ระดับปานกลาง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — สัตว์อาจหิวหรือต้องการอาหาร/น้ำ`
    action = '🥩 ตรวจสอบตารางอาหารและน้ำ ให้อาหารเพิ่มหากจำเป็น'
    priority = 'MEDIUM'
    confidence = 0.76
  } else if (energy > 0.5 && pattern === 'varied') {
    label = 'Social / Herd Communication'
    meaning = `เสียงร้องหลายรูปแบบ พลังงาน ${energy.toFixed(2)} — การสื่อสารปกติภายในฝูง เช่น แม่เรียกลูก หรือสื่อสารระหว่างกัน`
    action = '✅ พฤติกรรมปกติ ไม่ต้องดำเนินการ'
    priority = 'LOW'
    confidence = 0.73
  } else if (energy > 0.6 && pattern === 'single_burst') {
    label = 'Startle / Discomfort'
    meaning = `เสียงสั้นพลังงานสูง (${energy.toFixed(2)}) — สัตว์ตกใจหรือไม่สบาย อาจเกิดจากสิ่งรบกวนในคอก`
    action = '🔍 ตรวจสอบสภาพแวดล้อมภายในคอก ลดเสียงรบกวน'
    priority = 'MEDIUM'
    confidence = 0.70
  } else if (energy < 0.3 && pattern === 'sustained') {
    label = 'Calm / Ruminating'
    meaning = `เสียงเบาต่อเนื่อง (${energy.toFixed(2)}) — สัตว์อยู่ในสภาวะสงบ อาจกำลังเคี้ยวเอื้องหรือพักผ่อน`
    action = '😊 สัตว์สุขภาพดี ผ่อนคลาย ไม่ต้องดำเนินการ'
    priority = 'BACKGROUND'
    confidence = 0.75
  } else if (energy > 0.5) {
    label = 'General Vocalization'
    meaning = `เสียงร้องพลังงาน ${energy.toFixed(2)} ความถี่ ${pitch} Hz — ยังไม่สามารถระบุสาเหตุชัดเจน`
    action = '📋 บันทึกและติดตามพฤติกรรมต่อเนื่อง'
    priority = 'LOW'
    confidence = 0.62
  } else {
    label = 'Quiet / Resting'
    meaning = `เสียงพลังงานต่ำ (${energy.toFixed(2)}) — สัตว์พักผ่อนหรือไม่ได้ส่งเสียง`
    action = 'ไม่มีสัญญาณผิดปกติ'
    priority = 'BACKGROUND'
    confidence = 0.60
  }

  if (spectralCentroid > 3000) confidence = Math.min(confidence + 0.05, 0.95)
  if (peakAmplitude > 0.9) confidence = Math.min(confidence + 0.03, 0.95)

  return buildAudioResult('[สัตว์]', label, meaning, action, priority, confidence, energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
}

// ========= Companion: เน้น emotions (happy / sad / anxious / playful) =========
function analyzeCompanionAudio(
  energy: number, pitch: number, duration: number, pattern: string,
  spectralCentroid: number, peakAmplitude: number, data: Record<string, unknown>
): AnalysisOutput {
  let label = '', meaning = '', action = ''
  let priority: AnalysisOutput['priority'] = 'LOW'
  let confidence = 0.65

  if (energy > 0.7 && pitch > 1500 && pattern === 'repeated_short') {
    label = 'Anxious / Fearful'
    meaning = `เสียงร้องซ้ำ ๆ ถี่ ๆ ความถี่สูง ${pitch} Hz พลังงานสูง (${energy.toFixed(2)}) — สัตว์เลี้ยงอาจกลัว วิตกกังวล หรือรู้สึกไม่ปลอดภัย`
    action = '🤗 อยู่ใกล้ ๆ ปลอบใจ ลดสิ่งเร้าที่ทำให้กลัว (เช่น เสียงดัง พายุ)'
    priority = 'HIGH'
    confidence = 0.83
  } else if (energy > 0.7 && pitch > 1000 && pattern === 'varied') {
    label = 'Happy / Excited'
    meaning = `เสียงร้องหลากหลาย พลังงานสูง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — สัตว์เลี้ยงดีใจ ตื่นเต้น อยากเล่น!`
    action = '🎾 เล่นกับเขาเถอะ! มีพลังงานเหลือเฟือ เหมาะกับ fetch หรือพาไปวิ่ง'
    priority = 'LOW'
    confidence = 0.85
  } else if (energy > 0.7 && pitch > 1000 && pattern === 'sustained') {
    label = 'Lonely / Separation Anxiety'
    meaning = `เสียงร้องยาวต่อเนื่อง พลังงานสูง (${energy.toFixed(2)}) — อาจรู้สึกเหงา ถูกทิ้งคนเดียว หรือต้องการความสนใจ`
    action = '💛 ให้เวลาอยู่ด้วย ควรฝึกให้คุ้นเคยกับการอยู่คนเดียวทีละน้อย'
    priority = 'MEDIUM'
    confidence = 0.78
  } else if (energy > 0.5 && pitch > 800 && pattern === 'repeated_short') {
    label = 'Hungry / Needs Attention'
    meaning = `เสียงร้องซ้ำ ๆ ปานกลาง (${energy.toFixed(2)}) ความถี่ ${pitch} Hz — สัตว์เลี้ยงอาจหิว กระหาย หรือต้องการออกไปข้างนอก`
    action = '🍖 ตรวจสอบอาหาร น้ำ และพาออกไปเดินเล่น'
    priority = 'LOW'
    confidence = 0.76
  } else if (energy > 0.6 && pattern === 'single_burst') {
    label = 'Surprised / Alert'
    meaning = `เสียงสั้นพลังงานสูง (${energy.toFixed(2)}) — ตกใจหรือตื่นตัว อาจเห็นหรือได้ยินอะไรแปลก ๆ`
    action = '👀 ดูว่ามีอะไรผิดปกติรอบบ้านไหม อาจมีคนมา หรือสัตว์อื่นเข้าใกล้'
    priority = 'LOW'
    confidence = 0.70
  } else if (energy < 0.3 && pattern === 'sustained') {
    label = 'Relaxed / Purring'
    meaning = `เสียงเบานุ่มต่อเนื่อง (${energy.toFixed(2)}) — สัตว์เลี้ยงผ่อนคลาย สบายใจ อาจกำลังง่วงหรือ purring`
    action = '😸 อารมณ์ดี ผ่อนคลาย หลับสบาย~'
    priority = 'BACKGROUND'
    confidence = 0.80
  } else if (energy > 0.4 && pitch < 500) {
    label = 'Growling / Uncomfortable'
    meaning = `เสียงทุ้มต่ำ ความถี่ ${pitch} Hz พลังงาน ${energy.toFixed(2)} — อาจรู้สึกไม่สบาย หงุดหงิด หรือเตือนไม่ให้เข้าใกล้`
    action = '⚠️ ให้พื้นที่ส่วนตัว อย่าบังคับ อาจไม่สบายหรือเจ็บปวด'
    priority = 'MEDIUM'
    confidence = 0.72
  } else if (energy > 0.5) {
    label = 'Playful / Communicating'
    meaning = `เสียงร้องพลังงาน ${energy.toFixed(2)} — สัตว์เลี้ยงกำลังสื่อสารหรืออยากเล่น`
    action = '🐾 ลองเล่นด้วยหรือให้ของเล่น'
    priority = 'LOW'
    confidence = 0.65
  } else {
    label = 'Quiet / Sleeping'
    meaning = `เสียงพลังงานต่ำ (${energy.toFixed(2)}) — สัตว์เลี้ยงอยู่เงียบ ๆ อาจนอนหลับหรือพักผ่อน`
    action = '💤 ปล่อยให้พักผ่อน ไม่ต้องรบกวน'
    priority = 'BACKGROUND'
    confidence = 0.60
  }

  if (spectralCentroid > 3000) confidence = Math.min(confidence + 0.05, 0.95)
  if (peakAmplitude > 0.9) confidence = Math.min(confidence + 0.03, 0.95)

  return buildAudioResult('[สัตว์]', label, meaning, action, priority, confidence, energy, pitch, duration, pattern, spectralCentroid, peakAmplitude, data)
}

// ========= Shared result builder =========
function buildAudioResult(
  prefix: string, label: string, meaning: string, action: string,
  priority: AnalysisOutput['priority'], confidence: number,
  energy: number, pitch: number, duration: number, pattern: string,
  spectralCentroid: number, peakAmplitude: number, data: Record<string, unknown>
): AnalysisOutput {
  return {
    meaning: `${prefix} ${meaning}`,
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
