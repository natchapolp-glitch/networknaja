/**
 * Real movement data analyzer for Wildlife use case
 * Analyzes GPS/movement CSV data and classifies animal behavior
 */

import type { AnalysisOutput } from '../data/mockResponses'

interface MovementRow {
  t?: number
  x?: number
  y?: number
  v?: number
  lat?: number
  lng?: number
  velocity?: number
  speed?: number
  [key: string]: unknown
}

interface MovementData {
  rows?: MovementRow[]
  path?: MovementRow[]
  headers?: string[]
  total_points?: number
  avg_velocity_kmh?: number
  max_velocity_kmh?: number
  distance_km?: number
  direction_changes?: number
  rest_periods?: number
  duration_hours?: number
  cluster_count?: number
  [key: string]: unknown
}

/**
 * Analyze movement data (from CSV or JSON) and return semantic interpretation
 */
export function analyzeMovementData(data: MovementData): AnalysisOutput {
  // Extract or compute features
  const points = data.rows || data.path || []
  const totalPoints = data.total_points || points.length

  let avgVelocity = data.avg_velocity_kmh ?? 0
  let maxVelocity = data.max_velocity_kmh ?? 0
  let distance = data.distance_km ?? 0
  let directionChanges = data.direction_changes ?? 0
  let restPeriods = data.rest_periods ?? 0
  let duration = data.duration_hours ?? 0
  const clusterCount = data.cluster_count ?? 0

  // If we have raw points, compute features from them
  if (points.length >= 2 && avgVelocity === 0) {
    const computed = computeFromPoints(points)
    avgVelocity = computed.avgVelocity
    maxVelocity = computed.maxVelocity
    distance = computed.distance
    directionChanges = computed.directionChanges
    restPeriods = computed.restPeriods
    duration = computed.duration
  }

  // Rule-based classification
  let label = ''
  let meaning = ''
  let action = ''
  let priority: AnalysisOutput['priority'] = 'LOW'
  let confidence = 0.65

  // Pattern 1: Migration — long distance, consistent direction, moderate speed
  if (distance > 10 && avgVelocity > 2 && directionChanges < 10) {
    label = 'Seasonal Migration'
    meaning = `ตรวจพบรูปแบบการอพยพ — ระยะทาง ${distance.toFixed(1)} km ความเร็วเฉลี่ย ${avgVelocity.toFixed(1)} km/h ทิศทางค่อนข้างคงที่ (เปลี่ยน ${directionChanges} ครั้ง)`
    action = '📡 แจ้งเจ้าหน้าที่พิทักษ์ป่าให้เฝ้าระวังเส้นทางล่วงหน้า เพื่อป้องกันความขัดแย้งกับชุมชน'
    priority = 'MEDIUM'
    confidence = 0.82
  }
  // Pattern 2: Fleeing — high max velocity, sudden direction changes
  else if (maxVelocity > 15 && directionChanges > 5 && avgVelocity > 5) {
    label = 'Fleeing / Alarm'
    meaning = `ตรวจพบการเคลื่อนที่เร็วผิดปกติ — ความเร็วสูงสุด ${maxVelocity.toFixed(1)} km/h เปลี่ยนทิศ ${directionChanges} ครั้ง อาจกำลังหนีจากอันตราย`
    action = '🚨 ตรวจสอบพื้นที่ทันที อาจมีผู้ลักลอบล่าสัตว์หรือภัยคุกคามอื่น'
    priority = 'CRITICAL'
    confidence = 0.78
  }
  // Pattern 3: Foraging — low-moderate speed, many direction changes, short distance
  else if (avgVelocity > 0.5 && avgVelocity < 4 && directionChanges > 8) {
    label = 'Foraging Behavior'
    meaning = `ความเร็วต่ำ-ปานกลาง (${avgVelocity.toFixed(1)} km/h) เปลี่ยนทิศบ่อย (${directionChanges} ครั้ง) — รูปแบบการหาอาหาร`
    action = '🌿 พฤติกรรมปกติ สัตว์กำลังหากิน ไม่ต้องดำเนินการ'
    priority = 'BACKGROUND'
    confidence = 0.76
  }
  // Pattern 4: Resting — very low velocity, few direction changes
  else if (avgVelocity < 0.5 && restPeriods > 0) {
    label = 'Resting / Stationary'
    meaning = `แทบไม่มีการเคลื่อนไหว — ความเร็วเฉลี่ย ${avgVelocity.toFixed(1)} km/h มีช่วงพัก ${restPeriods} ช่วง`
    action = '😴 สัตว์กำลังพักผ่อน ไม่มีสัญญาณผิดปกติ'
    priority = 'BACKGROUND'
    confidence = 0.80
  }
  // Pattern 5: Territorial patrolling — moderate speed, circular/cluster pattern
  else if (clusterCount >= 2 && avgVelocity > 1 && avgVelocity < 6) {
    label = 'Territorial Patrol'
    meaning = `เคลื่อนที่วนรอบ ${clusterCount} จุดศูนย์กลาง ความเร็ว ${avgVelocity.toFixed(1)} km/h — รูปแบบการลาดตระเวนอาณาเขต`
    action = '🗺️ ติดตามขอบเขตอาณาเขต ตรวจสอบว่ามีการบุกรุกหรือไม่'
    priority = 'LOW'
    confidence = 0.72
  }
  // Generic active movement
  else if (avgVelocity > 0.5) {
    label = 'Active Movement'
    meaning = `ตรวจพบการเคลื่อนไหว — ความเร็วเฉลี่ย ${avgVelocity.toFixed(1)} km/h ระยะทาง ${distance.toFixed(1)} km ใน ${duration.toFixed(0)} ชม.`
    action = '📊 ติดตามเพิ่มเติมเพื่อจำแนกพฤติกรรม'
    priority = 'LOW'
    confidence = 0.60
  }
  // Very little data
  else {
    label = 'Insufficient Movement'
    meaning = `ข้อมูลการเคลื่อนไหวน้อยเกินไป (${totalPoints} จุด) ไม่สามารถจำแนกพฤติกรรมได้ชัดเจน`
    action = '⏳ เก็บข้อมูลเพิ่มเติมเพื่อให้ได้ผลที่แม่นยำกว่านี้'
    priority = 'LOW'
    confidence = 0.45
  }

  // Boost confidence with more data points
  if (totalPoints > 20) confidence = Math.min(confidence + 0.05, 0.95)
  if (totalPoints > 100) confidence = Math.min(confidence + 0.05, 0.95)

  return {
    meaning: `[สัตว์] ${meaning}`,
    label,
    confidence,
    action,
    priority,
    rawFeatures: {
      avg_velocity_kmh: round(avgVelocity),
      max_velocity_kmh: round(maxVelocity),
      distance_km: round(distance),
      direction_changes: directionChanges,
      rest_periods: restPeriods,
      duration_hours: round(duration),
      total_points: totalPoints,
    },
    details: `วิเคราะห์จากข้อมูลการเคลื่อนไหว ${totalPoints} จุด ระยะเวลา ${duration.toFixed(1)} ชม. — ใช้ rule-based movement pattern classifier`,
  }
}

// ============ Internal helpers ============

function computeFromPoints(points: MovementRow[]) {
  let totalDist = 0
  let maxV = 0
  let dirChanges = 0
  let restCount = 0
  let inRest = false
  const velocities: number[] = []

  for (let i = 0; i < points.length; i++) {
    const p = points[i]
    const v = p.v ?? p.velocity ?? p.speed ?? 0
    velocities.push(v)
    if (v > maxV) maxV = v

    // Rest detection (v < 0.3 km/h)
    if (v < 0.3) {
      if (!inRest) { restCount++; inRest = true }
    } else {
      inRest = false
    }

    // Distance between consecutive points
    if (i > 0) {
      const prev = points[i - 1]
      const x1 = prev.x ?? prev.lng ?? 0
      const y1 = prev.y ?? prev.lat ?? 0
      const x2 = p.x ?? p.lng ?? 0
      const y2 = p.y ?? p.lat ?? 0
      totalDist += haversineKm(y1, x1, y2, x2)
    }

    // Direction change detection
    if (i >= 2) {
      const pPrev = points[i - 2]
      const pMid = points[i - 1]
      const dx1 = (pMid.x ?? pMid.lng ?? 0) - (pPrev.x ?? pPrev.lng ?? 0)
      const dy1 = (pMid.y ?? pMid.lat ?? 0) - (pPrev.y ?? pPrev.lat ?? 0)
      const dx2 = (p.x ?? p.lng ?? 0) - (pMid.x ?? pMid.lng ?? 0)
      const dy2 = (p.y ?? p.lat ?? 0) - (pMid.y ?? pMid.lat ?? 0)
      const angle1 = Math.atan2(dy1, dx1)
      const angle2 = Math.atan2(dy2, dx2)
      let diff = Math.abs(angle2 - angle1)
      if (diff > Math.PI) diff = 2 * Math.PI - diff
      if (diff > Math.PI / 4) dirChanges++ // > 45° = direction change
    }
  }

  const avgV = velocities.length > 0
    ? velocities.reduce((a, b) => a + b, 0) / velocities.length
    : 0

  // Duration from time field
  const tFirst = points[0]?.t ?? 0
  const tLast = points[points.length - 1]?.t ?? 0
  const dur = tLast > tFirst ? tLast - tFirst : 0

  return {
    avgVelocity: avgV,
    maxVelocity: maxV,
    distance: totalDist,
    directionChanges: dirChanges,
    restPeriods: restCount,
    duration: dur,
  }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
