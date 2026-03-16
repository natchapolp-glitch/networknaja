/**
 * Real audio analysis using Web Audio API
 * Extracts features like energy, pitch, duration, pattern from MP3/WAV files
 */

export interface AudioFeatures {
  energy: number          // 0-1, overall energy / loudness
  pitch: number           // Hz, estimated dominant frequency
  duration: number        // seconds
  pattern: string         // "repeated_short" | "sustained" | "varied" | "single_burst"
  sampleRate: number
  peakAmplitude: number   // 0-1
  zeroCrossingRate: number
  spectralCentroid: number
}

/**
 * Analyze an audio file (MP3, WAV, OGG, etc.) and extract features
 */
export async function analyzeAudioFile(file: File): Promise<AudioFeatures> {
  const audioContext = new AudioContext()

  try {
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    const channelData = audioBuffer.getChannelData(0) // mono or left channel
    const sampleRate = audioBuffer.sampleRate
    const duration = audioBuffer.duration

    // 1. Calculate RMS Energy (normalized 0-1)
    const energy = calculateRMSEnergy(channelData)

    // 2. Calculate Peak Amplitude
    const peakAmplitude = calculatePeakAmplitude(channelData)

    // 3. Estimate Dominant Pitch using autocorrelation
    const pitch = estimatePitch(channelData, sampleRate)

    // 4. Calculate Zero Crossing Rate
    const zeroCrossingRate = calculateZeroCrossingRate(channelData)

    // 5. Calculate Spectral Centroid (brightness)
    const spectralCentroid = calculateSpectralCentroid(channelData, sampleRate)

    // 6. Detect Pattern
    const pattern = detectPattern(channelData, sampleRate)

    return {
      energy: Math.round(energy * 1000) / 1000,
      pitch: Math.round(pitch),
      duration: Math.round(duration * 100) / 100,
      pattern,
      sampleRate,
      peakAmplitude: Math.round(peakAmplitude * 1000) / 1000,
      zeroCrossingRate: Math.round(zeroCrossingRate * 1000) / 1000,
      spectralCentroid: Math.round(spectralCentroid),
    }
  } finally {
    await audioContext.close()
  }
}

function calculateRMSEnergy(data: Float32Array): number {
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i]
  }
  const rms = Math.sqrt(sum / data.length)
  // Normalize: typical speech/animal RMS is 0.01-0.3
  return Math.min(1, rms * 5)
}

function calculatePeakAmplitude(data: Float32Array): number {
  let max = 0
  for (let i = 0; i < data.length; i++) {
    const abs = Math.abs(data[i])
    if (abs > max) max = abs
  }
  return max
}

function estimatePitch(data: Float32Array, sampleRate: number): number {
  // Autocorrelation-based pitch detection
  const minFreq = 50   // Hz
  const maxFreq = 4000  // Hz
  const minPeriod = Math.floor(sampleRate / maxFreq)
  const maxPeriod = Math.floor(sampleRate / minFreq)

  // Use a chunk from the middle of the audio
  const chunkSize = Math.min(data.length, sampleRate) // max 1 second
  const start = Math.floor((data.length - chunkSize) / 2)
  const chunk = data.slice(start, start + chunkSize)

  let bestCorrelation = 0
  let bestPeriod = minPeriod

  for (let period = minPeriod; period < Math.min(maxPeriod, chunk.length / 2); period++) {
    let correlation = 0
    let norm1 = 0
    let norm2 = 0
    const testLen = Math.min(chunk.length - period, 2000)

    for (let i = 0; i < testLen; i++) {
      correlation += chunk[i] * chunk[i + period]
      norm1 += chunk[i] * chunk[i]
      norm2 += chunk[i + period] * chunk[i + period]
    }

    const normalizedCorrelation = correlation / (Math.sqrt(norm1 * norm2) + 1e-10)

    if (normalizedCorrelation > bestCorrelation) {
      bestCorrelation = normalizedCorrelation
      bestPeriod = period
    }
  }

  // If correlation is too low, no clear pitch
  if (bestCorrelation < 0.2) {
    return 0 // no clear pitch detected
  }

  return sampleRate / bestPeriod
}

function calculateZeroCrossingRate(data: Float32Array): number {
  let crossings = 0
  for (let i = 1; i < data.length; i++) {
    if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
      crossings++
    }
  }
  return crossings / data.length
}

function calculateSpectralCentroid(data: Float32Array, sampleRate: number): number {
  // Simple FFT-based spectral centroid using a chunk
  const fftSize = 2048
  const chunk = data.slice(0, Math.min(data.length, fftSize))

  // Apply Hanning window
  const windowed = new Float32Array(fftSize)
  for (let i = 0; i < chunk.length; i++) {
    windowed[i] = chunk[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (chunk.length - 1)))
  }

  // Simple DFT for the first half
  const halfSize = fftSize / 2
  let weightedSum = 0
  let magnitudeSum = 0

  for (let k = 0; k < halfSize; k++) {
    let re = 0, im = 0
    for (let n = 0; n < fftSize; n++) {
      const angle = -2 * Math.PI * k * n / fftSize
      re += windowed[n] * Math.cos(angle)
      im += windowed[n] * Math.sin(angle)
    }
    const magnitude = Math.sqrt(re * re + im * im)
    const frequency = k * sampleRate / fftSize
    weightedSum += magnitude * frequency
    magnitudeSum += magnitude
  }

  return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
}

function detectPattern(data: Float32Array, sampleRate: number): string {
  // Detect pattern by analyzing amplitude envelope
  const windowSize = Math.floor(sampleRate * 0.05) // 50ms windows
  const envelope: number[] = []

  for (let i = 0; i < data.length; i += windowSize) {
    let sum = 0
    const end = Math.min(i + windowSize, data.length)
    for (let j = i; j < end; j++) {
      sum += Math.abs(data[j])
    }
    envelope.push(sum / (end - i))
  }

  // Find segments above threshold
  const threshold = Math.max(...envelope) * 0.2
  const segments: { start: number; end: number }[] = []
  let inSegment = false
  let segStart = 0

  for (let i = 0; i < envelope.length; i++) {
    if (envelope[i] > threshold && !inSegment) {
      inSegment = true
      segStart = i
    } else if (envelope[i] <= threshold && inSegment) {
      inSegment = false
      segments.push({ start: segStart, end: i })
    }
  }
  if (inSegment) segments.push({ start: segStart, end: envelope.length })

  const duration = data.length / sampleRate

  if (segments.length === 0) return 'silence'
  if (segments.length === 1) {
    const segDuration = (segments[0].end - segments[0].start) * 0.05
    return segDuration > duration * 0.6 ? 'sustained' : 'single_burst'
  }
  if (segments.length >= 3) {
    // Check if segments are roughly equal → repeated
    const lengths = segments.map(s => s.end - s.start)
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const isRepeated = lengths.every(l => Math.abs(l - avgLen) < avgLen * 0.5)
    if (isRepeated && avgLen * 0.05 < 0.5) return 'repeated_short'
    return 'varied'
  }
  return 'varied'
}
