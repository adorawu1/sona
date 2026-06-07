/*
 * Audio feature extraction functions for analyzing sound properties.
 */

const HZ_PER_BIN = 44100 / 2048  // ≈ 21.53 Hz — width of each FFT bin

// X axis — spectral centroid
// Center of mass of the frequency spectrum.
// High = bright/trebly. Low = dark/bassy.
export function centroid(fftData) {
  let num = 0
  let den = 0
  for (let i = 0; i < fftData.length; i++) {
    num += i * HZ_PER_BIN * fftData[i]
    den += fftData[i]
  }
  return den < 1 ? 0 : num / den  // guard against silence
}

// Y axis — RMS amplitude
// Perceptual loudness of the signal.
export function rms(waveformData) {
  let sum = 0
  for (let i = 0; i < waveformData.length; i++) {
    const s = (waveformData[i] - 128) / 128  // re-center to -1..1
    sum += s * s
  }
  return Math.sqrt(sum / waveformData.length)
}

// Z axis — spectral flux
// How much the spectrum changed since the last frame.
// High = transition or onset. Low = stable tone or silence.
export function flux(currentFFT, prevFFT) {
  let sum = 0
  for (let i = 0; i < currentFFT.length; i++) {
    const diff = currentFFT[i] - prevFFT[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}