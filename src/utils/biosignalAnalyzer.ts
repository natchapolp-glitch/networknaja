/**
 * Real biosignal data analyzer for Livestock & Wildlife use cases
 * Analyzes vital signs / biosignal JSON and classifies health & stress states
 */

import type { AnalysisOutput } from '../data/mockResponses'

interface BiosignalData {
  animal_id?: string
  species?: string
  heartRate_bpm?: number
  temperature_c?: number
  cortisol_ngml?: number
  spO2_pct?: number
  activity_level?: string
  rumination_min_per_hr?: number
  ambient_temp_c?: number
  humidity_pct?: number
  territory_breach?: boolean
  purring?: boolean
  [key: string]: unknown
}

// Normal ranges per category
const RANGES = {
  livestock: {
    heartRate: { low: 48, high: 84 },       // cattle normal range
    temperature: { low: 38.0, high: 39.3 },
    cortisol: { low: 0, high: 12 },
    spO2: { low: 95, high: 100 },
    rumination: { low: 25, high: 40 },       // min/hr
  },
  wildlife: {
    heartRate: { low: 40, high: 100 },       // varies widely
    temperature: { low: 37.5, high: 39.5 },
    cortisol: { low: 0, high: 15 },
    spO2: { low: 93, high: 100 },
    rumination: { low: 0, high: 0 },         // not applicable for most
  },
  companion: {
    heartRate: { low: 60, high: 160 },       // dogs 60-140, cats 120-200
    temperature: { low: 37.8, high: 39.2 },
    cortisol: { low: 0, high: 8 },
    spO2: { low: 95, high: 100 },
    rumination: { low: 0, high: 0 },
  },
}

const USE_CASE_LABELS: Record<string, string> = {
  wildlife: 'สัตว์',
  livestock: 'สัตว์',
  companion: 'สัตว์',
}

/**
 * Check if data looks like biosignal data
 */
export function isBiosignalData(data: Record<string, unknown>): boolean {
  const keys = Object.keys(data)
  const biosignalKeys = ['heartRate_bpm', 'temperature_c', 'cortisol_ngml', 'spO2_pct', 'activity_level']
  return biosignalKeys.filter(k => keys.includes(k)).length >= 2
}

/**
 * Analyze biosignal data and produce semantic interpretation
 */
export function analyzeBiosignalData(data: BiosignalData, useCase: string): AnalysisOutput {
  const range = RANGES[useCase as keyof typeof RANGES] || RANGES.livestock
  const contextLabel = USE_CASE_LABELS[useCase] || useCase

  const hr = data.heartRate_bpm ?? 0
  const temp = data.temperature_c ?? 0
  const cortisol = data.cortisol_ngml ?? 0
  const spO2 = data.spO2_pct ?? 100
  const activity = data.activity_level ?? 'unknown'
  const rumination = data.rumination_min_per_hr ?? -1
  const ambientTemp = data.ambient_temp_c ?? 0
  const humidity = data.humidity_pct ?? 0
  const territoryBreach = data.territory_breach ?? false
  const purring = data.purring ?? false

  // Flags
  const highHR = hr > range.heartRate.high
  const lowHR = hr > 0 && hr < range.heartRate.low
  const highTemp = temp > range.temperature.high
  const highCortisol = cortisol > range.cortisol.high
  const lowSpO2 = spO2 < range.spO2.low
  const lowRumination = rumination >= 0 && range.rumination.high > 0 && rumination < range.rumination.low
  const highAmbient = ambientTemp > 33
  const highHumidity = humidity > 70

  let label = ''
  let meaning = ''
  let action = ''
  let priority: AnalysisOutput['priority'] = 'LOW'
  let confidence = 0.65

  // === Critical conditions ===

  // Territorial stress (wildlife)
  if (territoryBreach && highCortisol && activity === 'high') {
    label = 'Territorial Stress'
    meaning = `ตรวจพบการบุกรุกอาณาเขต — Cortisol สูง ${cortisol} ng/ml + กิจกรรมสูง → สัตว์อยู่ในสภาวะเครียดจากการปกป้องพื้นที่`
    action = '🚨 แจ้งเจ้าหน้าที่ทันที ตรวจสอบพื้นที่รอบอาณาเขต อาจมีมนุษย์หรือสัตว์บุกรุก'
    priority = 'CRITICAL'
    confidence = 0.88
  }
  // Heat stress (livestock focus)
  else if (highTemp && highCortisol && (highAmbient || highHumidity)) {
    label = 'Heat Stress'
    meaning = `อุณหภูมิร่างกาย ${temp}°C สูงกว่าปกติ + Cortisol ${cortisol} ng/ml + อุณหภูมิแวดล้อม ${ambientTemp}°C ความชื้น ${humidity}% → สัญญาณ heat stress ชัดเจน`
    action = '🚿 ลดอุณหภูมิในคอกทันที — เปิดพัดลม/สเปรย์น้ำ ลดความแออัด ให้น้ำเย็นเพิ่ม'
    priority = 'HIGH'
    confidence = 0.91

    if (lowRumination) {
      meaning += ` + เคี้ยวเอื้องลดลง (${rumination} นาที/ชม.) ยืนยัน heat stress`
      confidence = Math.min(confidence + 0.03, 0.95)
    }
  }
  // Respiratory distress
  else if (lowSpO2 && highHR) {
    label = 'Respiratory Distress'
    meaning = `SpO2 ต่ำ ${spO2}% + อัตราหัวใจสูง ${hr} bpm → ปัญหาระบบทางเดินหายใจ`
    action = '🏥 ต้องการการรักษาทางสัตวแพทย์เร่งด่วน ตรวจสอบระบบหายใจ'
    priority = 'CRITICAL'
    confidence = 0.85
  }
  // Distress / Pain
  else if (highHR && highCortisol) {
    label = 'Distress / Pain'
    meaning = `อัตราหัวใจสูง ${hr} bpm + Cortisol สูง ${cortisol} ng/ml → สัตว์อาจเจ็บปวดหรือเครียดรุนแรง`
    action = '🩺 ตรวจสัตว์โดยสัตวแพทย์ หาสาเหตุความเจ็บปวดหรือความเครียด'
    priority = 'HIGH'
    confidence = 0.80
  }
  // Fever without cortisol spike
  else if (highTemp && !highCortisol) {
    label = 'Elevated Temperature'
    meaning = `อุณหภูมิร่างกาย ${temp}°C สูงกว่าปกติเล็กน้อย แต่ Cortisol ปกติ (${cortisol} ng/ml) — อาจเป็นการติดเชื้อเบื้องต้น`
    action = '🌡️ ติดตามอุณหภูมิทุก 2 ชม. หากไม่ลดลง ควรตรวจโดยสัตวแพทย์'
    priority = 'MEDIUM'
    confidence = 0.72
  }
  // Cortisol high alone
  else if (highCortisol) {
    label = 'Stress Detected'
    meaning = `Cortisol สูง ${cortisol} ng/ml แม้สัญญาณอื่นปกติ — สัตว์อาจมีความเครียดจากสิ่งแวดล้อม`
    action = '🔍 ตรวจสอบสาเหตุความเครียด — เสียง, แสง, ความแออัด, สัตว์ตัวอื่น'
    priority = 'MEDIUM'
    confidence = 0.70
  }
  // Bradycardia
  else if (lowHR) {
    label = 'Low Heart Rate'
    meaning = `อัตราหัวใจต่ำ ${hr} bpm ต่ำกว่าเกณฑ์ปกติ — อาจหมายถึงภาวะหัวใจเต้นช้าหรือเกี่ยวกับยา`
    action = '🩺 ปรึกษาสัตวแพทย์หากค่าต่ำต่อเนื่อง'
    priority = 'MEDIUM'
    confidence = 0.65
  }
  // Relaxed / Content (companion)
  else if (purring && !highCortisol && !highTemp) {
    label = 'Relaxed / Content'
    meaning = `สัญญาณชีพปกติ + purring → ${contextLabel}อารมณ์ดี ผ่อนคลาย`
    action = '😸 อารมณ์ดี ไม่ต้องดำเนินการใด ๆ'
    priority = 'BACKGROUND'
    confidence = 0.90
  }
  // Low rumination only
  else if (lowRumination && !highTemp && !highCortisol) {
    label = 'Reduced Rumination'
    meaning = `เคี้ยวเอื้อง ${rumination} นาที/ชม. ต่ำกว่าเกณฑ์ แม้สัญญาณอื่นปกติ — อาจเป็นสัญญาณเริ่มต้นของปัญหาสุขภาพ`
    action = '📋 ติดตามพฤติกรรมกิน หากยังคงต่ำใน 6 ชม. ควรตรวจเพิ่ม'
    priority = 'LOW'
    confidence = 0.68
  }
  // All normal
  else {
    label = 'Healthy / Normal'
    meaning = `สัญญาณชีพทั้งหมดอยู่ในเกณฑ์ปกติ — อัตราหัวใจ ${hr} bpm, อุณหภูมิ ${temp}°C, Cortisol ${cortisol} ng/ml`
    action = '✅ สุขภาพดี ไม่ต้องดำเนินการใด ๆ'
    priority = 'BACKGROUND'
    confidence = 0.85
  }

  // Build raw features display
  const rawFeatures: Record<string, number | string> = {}
  if (hr) rawFeatures.heartRate_bpm = `${hr} ${highHR ? '(สูง)' : lowHR ? '(ต่ำ)' : '(ปกติ)'}`
  if (temp) rawFeatures.temperature_c = `${temp}°C ${highTemp ? '(สูง)' : '(ปกติ)'}`
  if (cortisol) rawFeatures.cortisol_ngml = `${cortisol} ${highCortisol ? '(สูง)' : '(ปกติ)'}`
  if (spO2 < 100) rawFeatures.spO2_pct = `${spO2}% ${lowSpO2 ? '(ต่ำ)' : '(ปกติ)'}`
  if (activity !== 'unknown') rawFeatures.activity = activity
  if (rumination >= 0 && range.rumination.high > 0) rawFeatures.rumination = `${rumination} min/hr ${lowRumination ? '(ต่ำ)' : '(ปกติ)'}`
  if (ambientTemp > 0) rawFeatures.ambient_temp = `${ambientTemp}°C`
  if (purring) rawFeatures.purring = 'true'
  if (territoryBreach) rawFeatures.territory_breach = 'true'

  const speciesInfo = data.species ? ` (${data.species})` : ''
  const idInfo = data.animal_id ? ` ID: ${data.animal_id}` : ''

  return {
    meaning: `[${contextLabel}] ${meaning}`,
    label,
    confidence,
    action,
    priority,
    rawFeatures,
    details: `วิเคราะห์สัญญาณชีวภาพ${speciesInfo}${idInfo} — ใช้ rule-based biosignal interpreter เทียบกับค่าปกติของ ${contextLabel}`,
  }
}
