/*
 * AudioEngine class manages audio input and analysis using the Web Audio API.
 */

const FFT_SIZE = 2048

export class AudioEngine {
  constructor() {
    this.ctx           = null
    this.analyser      = null
    this.fftArray      = null  // Uint8Array(1024)
    this.waveformArray = null  // Uint8Array(2048)
    this.prevFFT       = null  // Uint8Array(1024) — last frame snapshot
    this.ready         = false
  }

  // Must be called from a user gesture (button click).
  // Browsers block AudioContext creation until user interaction.
  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.ctx      = new AudioContext()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = FFT_SIZE
    this.analyser.smoothingTimeConstant = 0.8
    // 0 = no smoothing (jittery). 1 = maximum smoothing (sluggish).

    const source = this.ctx.createMediaStreamSource(stream)
    source.connect(this.analyser)
    // mic → analyser (not connected to speakers — analysis only)

    const bins = this.analyser.frequencyBinCount
    this.fftArray      = new Uint8Array(bins)
    this.prevFFT       = new Uint8Array(bins)
    this.waveformArray = new Uint8Array(FFT_SIZE)
    // All memory allocated once here. Never again.
    this.ready = true
  }

  // Fills and returns this.fftArray. Same reference every call.
  getFFT() {
    if (!this.ready) return null
    this.analyser.getByteFrequencyData(this.fftArray)
    return this.fftArray
  }

  // Fills and returns this.waveformArray. Same reference every call.
  getWaveform() {
    if (!this.ready) return null
    this.analyser.getByteTimeDomainData(this.waveformArray)
    return this.waveformArray
  }

  // Copies fftArray → prevFFT using TypedArray.set() — zero allocation.
  // Call AFTER flux() reads prevFFT, BEFORE next frame.
  storePrevFFT() {
    if (!this.ready) return
    this.prevFFT.set(this.fftArray)
  }
}