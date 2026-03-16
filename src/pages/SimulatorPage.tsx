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
          // Backend not available, use mock data
        }

        // Fallback to mock results
        const mockKey = getMockKey(activeTab, fileType)
        if (mockKey && mockResults[mockKey]) {
          setResult(mockResults[mockKey])
        } else {
          // Generate generic result from data
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
                <p className="text-sm text-[#ff3366]">❌ {error}</p>
              </div>
            )}

            {result && !isProcessing && (
              <AnalysisResult result={result} useCase={activeTab} />
            )}

            {!result && !isProcessing && (
              <div className="glass-card text-center py-16">
                <div className="text-4xl mb-4 opacity-30">
                  {activeTab === 'wildlife' ? '🦁' : activeTab === 'livestock' ? '🐄' : '🐕'}
                </div>
                <p className="text-sm text-slate-500">
                  อัปโหลดข้อมูลหรือใช้ข้อมูลตัวอย่าง<br />เพื่อเริ่มการวิเคราะห์
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
      ? '⚠️ ค่าบางตัวสูงกว่าปกติ ควรติดตามเพิ่มเติม'
      : '✅ ค่าทั้งหมดอยู่ในเกณฑ์ปกติ ไม่ต้องดำเนินการ',
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
