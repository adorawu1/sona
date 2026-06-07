import { AudioEngine } from './audio/AudioEngine.js'
import { SceneSetup }  from './scene/SceneSetup.js'
import { Ribbon }      from './scene/Ribbon.js'
import * as features   from './audio/features.js'
import { normalize }   from './utils/normalize.js'

// Normalization ranges — tune after first run
// Ribbon clusters at center → lower the max
// Ribbon clips at edge      → raise the max
const CENTROID_MAX = 4000
const RMS_MAX      = 0.8
const FLUX_MAX     = 3000

// Initialize all three systems independently
const container = document.getElementById('app')
const audio  = new AudioEngine()
const scene  = new SceneSetup(container)
const ribbon = new Ribbon(scene.scene)

// Mic button — AudioContext must start inside a user gesture
document.getElementById('start-btn').addEventListener('click', async () => {
  try {
    await audio.start()
    document.getElementById('start-btn').style.display = 'none'
  } catch (err) {
    document.getElementById('start-btn').textContent = 'mic unavailable'
    console.error(err)
  }
})

// Render loop — ~60fps, zero allocation per frame
function loop() {
  requestAnimationFrame(loop)

  const fft      = audio.getFFT()
  const waveform = audio.getWaveform()

  if (fft && waveform) {
    const x = normalize(features.centroid(fft),            0, CENTROID_MAX)
    const y = normalize(features.rms(waveform),            0, RMS_MAX)
    const z = normalize(features.flux(fft, audio.prevFFT), 0, FLUX_MAX)

    audio.storePrevFFT()  // after flux reads prevFFT, before next frame
    ribbon.update(x, y, z)
  }

  scene.controls.update()  // required every frame for damping
  scene.renderer.render(scene.scene, scene.camera)
}

loop()