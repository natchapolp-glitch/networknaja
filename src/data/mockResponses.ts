export interface AnalysisInput {
  type: 'sound' | 'movement' | 'biosignal'
  useCase: 'wildlife' | 'livestock' | 'companion'
  data: Record<string, unknown>
  fileName?: string
}

export interface AnalysisOutput {
  meaning: string
  label: string
  confidence: number
  action: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BACKGROUND'
  rawFeatures: Record<string, number | string>
  details: string
}

// ========= SAMPLE DATA =========

export const sampleData: Record<string, AnalysisInput> = {
  // Companion Animal — Sound
  companion_sound: {
    type: 'sound',
    useCase: 'companion',
    fileName: 'dog_bark_happy.wav',
    data: {
      duration_s: 2.3,
      avg_energy: 0.72,
      pitch_hz: 420,
      mfcc_mean: [12.3, -5.1, 3.8, 1.2, -0.9],
      spectral_centroid: 3200,
      bark_count: 4,
      pattern: 'short_repeated',
    },
  },
  // Wildlife — Movement
  wildlife_movement: {
    type: 'movement',
    useCase: 'wildlife',
    fileName: 'elephant_migration.csv',
    data: {
      total_points: 48,
      duration_hours: 24,
      avg_velocity_kmh: 4.2,
      max_velocity_kmh: 12.8,
      distance_km: 18.5,
      direction_changes: 7,
      rest_periods: 3,
      cluster_count: 2,
      path: [
        { t: 0, x: 100.5, y: 14.2, v: 3.1 },
        { t: 1, x: 100.52, y: 14.22, v: 4.5 },
        { t: 2, x: 100.55, y: 14.25, v: 5.2 },
        { t: 6, x: 100.62, y: 14.31, v: 0.2 },
        { t: 12, x: 100.68, y: 14.38, v: 6.8 },
        { t: 18, x: 100.75, y: 14.42, v: 3.9 },
        { t: 24, x: 100.82, y: 14.5, v: 1.1 },
      ],
    },
  },
  // Livestock — Biosignal
  livestock_biosignal: {
    type: 'biosignal',
    useCase: 'livestock',
    fileName: 'cow_vitals_herd_07.json',
    data: {
      animal_id: 'COW-2847',
      species: 'Bos taurus',
      heartRate_bpm: 92,
      temperature_c: 39.8,
      cortisol_ngml: 18.5,
      spO2_pct: 94,
      activity_level: 'low',
      rumination_min_per_hr: 12,
      ambient_temp_c: 36,
      humidity_pct: 78,
    },
  },
  // Extra samples
  companion_biosignal: {
    type: 'biosignal',
    useCase: 'companion',
    fileName: 'cat_vitals.json',
    data: {
      animal_id: 'CAT-0192',
      species: 'Felis catus',
      heartRate_bpm: 160,
      temperature_c: 38.3,
      cortisol_ngml: 4.2,
      spO2_pct: 98,
      activity_level: 'medium',
      purring: true,
    },
  },
  wildlife_biosignal: {
    type: 'biosignal',
    useCase: 'wildlife',
    fileName: 'tiger_vitals.json',
    data: {
      animal_id: 'TGR-0039',
      species: 'Panthera tigris',
      heartRate_bpm: 110,
      temperature_c: 39.1,
      cortisol_ngml: 22.0,
      spO2_pct: 96,
      activity_level: 'high',
      territory_breach: true,
    },
  },
}

// ========= MOCK ANALYSIS RESULTS =========

export const mockResults: Record<string, AnalysisOutput> = {
  companion_sound: {
    meaning: 'สุนัขแสดงอารมณ์ดีใจ กระตือรือร้น ต้องการเล่นหรือได้รับความสนใจ',
    label: 'Happy / Excited',
    confidence: 0.87,
    action: '🎾 เล่นกับเขาเถอะ! สุนัขมีพลังงานเหลือเฟือ เหมาะกับการพาไปวิ่งหรือเล่น fetch',
    priority: 'LOW',
    rawFeatures: {
      avg_energy: 0.72,
      pitch_hz: 420,
      bark_pattern: 'short_repeated',
      spectral_centroid: 3200,
    },
    details: 'เสียงเห่าสั้นซ้ำ ๆ (4 ครั้ง) พร้อมพลังงานสูง และความถี่สูง บ่งบอกถึงความตื่นเต้น ไม่ใช่ความก้าวร้าว',
  },
  wildlife_movement: {
    meaning: 'ช้างกำลังอพยพตามฤดูกาล เส้นทางปกติ ไม่มีสัญญาณอันตราย',
    label: 'Seasonal Migration',
    confidence: 0.79,
    action: '📡 แจ้งเจ้าหน้าที่พิทักษ์ป่าให้เฝ้าระวังเส้นทางล่วงหน้า เพื่อป้องกันความขัดแย้งกับชุมชน',
    priority: 'MEDIUM',
    rawFeatures: {
      avg_velocity: '4.2 km/h',
      distance: '18.5 km',
      direction_changes: 7,
      rest_periods: 3,
    },
    details: 'ความเร็วเฉลี่ย 4.2 km/h ระยะทาง 18.5 km ใน 24 ชม. มีจุดพัก 3 จุด ทิศทางสอดคล้องกับเส้นทางอพยพตามฤดูกาล',
  },
  livestock_biosignal: {
    meaning: 'วัวมีสัญญาณความเครียดจากความร้อน (heat stress) ค่า cortisol สูงผิดปกติ',
    label: 'Heat Stress',
    confidence: 0.91,
    action: '🚿 ลดอุณหภูมิในคอกทันที — เปิดพัดลม/สเปรย์น้ำ ลดความแออัด ให้น้ำเย็นเพิ่ม',
    priority: 'HIGH',
    rawFeatures: {
      heartRate: '92 bpm (สูง)',
      temperature: '39.8°C (สูง)',
      cortisol: '18.5 ng/ml (สูงมาก)',
      rumination: '12 min/hr (ต่ำ)',
    },
    details: 'อุณหภูมิร่างกาย 39.8°C + cortisol 18.5 ng/ml + อุณหภูมิแวดล้อม 36°C + ความชื้น 78% = สัญญาณ heat stress ชัดเจน',
  },
  companion_biosignal: {
    meaning: 'แมวสุขภาพดี ผ่อนคลาย มีพฤติกรรม purring',
    label: 'Relaxed / Content',
    confidence: 0.93,
    action: '😸 แมวอารมณ์ดี ไม่ต้องดำเนินการใด ๆ — อาจลูบหรือเล่นเบา ๆ ได้',
    priority: 'BACKGROUND',
    rawFeatures: {
      heartRate: '160 bpm (ปกติ)',
      temperature: '38.3°C (ปกติ)',
      cortisol: '4.2 ng/ml (ต่ำ)',
      purring: 'true',
    },
    details: 'สัญญาณชีพทั้งหมดอยู่ในเกณฑ์ปกติ cortisol ต่ำ + purring = สัญญาณความพึงพอใจ',
  },
  wildlife_biosignal: {
    meaning: 'เสือมีความเครียดสูง ตรวจพบเหตุบุกรุกอาณาเขต',
    label: 'Territorial Stress',
    confidence: 0.85,
    action: '🚨 แจ้งเตือนเจ้าหน้าที่ทันที — ตรวจสอบพื้นที่รอบอาณาเขตเสือ อาจมีมนุษย์หรือสัตว์บุกรุก',
    priority: 'CRITICAL',
    rawFeatures: {
      heartRate: '110 bpm (สูง)',
      cortisol: '22.0 ng/ml (สูงมาก)',
      activity: 'high',
      territory_breach: 'true',
    },
    details: 'Cortisol สูง 22 ng/ml + activity สูง + territory_breach = สถานการณ์เร่งด่วน ต้องตรวจสอบทันที',
  },
}
