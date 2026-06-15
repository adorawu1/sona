import { AudioEngine } from './audio/AudioEngine.js'
import { SceneSetup }  from './scene/SceneSetup.js'
import { Ribbon }      from './scene/Ribbon.js'
import * as features   from './audio/features.js'
import { normalize }   from './utils/normalize.js'

// Normalization ranges — tune after first run
// Ribbon clusters at center → lower the max
// Ribbon clips at edge      → raise the max
const CENTROID_MAX  = 3000
const RMS_FLOOR     = 0.02   // sounds below this are treated as silence
const RMS_MAX       = 0.3
const FLUX_FLOOR    = 100    // spectral noise floor
const FLUX_MAX      = 1800

// Initialize all three systems independently
const container = document.getElementById('app')
const audio  = new AudioEngine()
const scene  = new SceneSetup(container)
const ribbon = new Ribbon(scene.scene)

// Mic button — AudioContext must start inside a user gesture
const button = document.getElementById('start-btn')
button.addEventListener('click', async () => {
  try {
    await audio.start()
    button.style.display = 'none'
  } catch (err) {
    button.textContent = 'mic unavailable'
    console.error(err)
  }
})

// Render loop — ~60fps, zero allocation per frame
function loop() {
  requestAnimationFrame(loop)

  const fft      = audio.getFFT()
  const waveform = audio.getWaveform()

  if (fft && waveform) {
    const x = normalize(features.centroid(fft),            0,         CENTROID_MAX)
    const y = normalize(features.rms(waveform),            RMS_FLOOR, RMS_MAX)
    const z = normalize(features.flux(fft, audio.prevFFT), FLUX_FLOOR, FLUX_MAX)

    audio.storePrevFFT()  // after flux reads prevFFT, before next frame
    ribbon.update(x, y, z)
  }

  scene.controls.update()  // required every frame for damping
  scene.composer.render()
}

loop()