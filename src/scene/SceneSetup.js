/*
 * SceneSetup class initializes the Three.js scene, camera, renderer, and orbit controls.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function makeAxis(from, to, color) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to])
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 })
  return new THREE.Line(geo, mat)
}

function makeLabel(text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = color
  ctx.font = '28px monospace'
  ctx.fillText(text, 8, 44)
  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.5 })
  return new THREE.Sprite(mat)
}

export class SceneSetup {
  constructor(container) {

    // Renderer — creates a <canvas> and appends it to the container div
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(this.renderer.domElement)

    // Scene — the container for all 3D objects
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x080608)
    // Near-black with a faint warm tint — pure black makes lines look harsh

    // Axes — thin colored lines grounding the ribbon in acoustic space
    const V = (x, y, z) => new THREE.Vector3(x, y, z)
    this.scene.add(makeAxis(V(-1.3, 0, 0), V(1.3, 0, 0), 0xff4444))  // X — brightness
    this.scene.add(makeAxis(V(0, -1.3, 0), V(0, 1.3, 0), 0x44ff44))  // Y — loudness
    this.scene.add(makeAxis(V(0, 0, -1.3), V(0, 0, 1.3), 0x4444ff))  // Z — flux

    const xLabel = makeLabel('brightness', '#ff4444')
    xLabel.position.set(1.5, 0.12, 0)
    xLabel.scale.set(0.4, 0.1, 1)
    this.scene.add(xLabel)

    const yLabel = makeLabel('loudness', '#44ff44')
    yLabel.position.set(0.25, 1.45, 0)
    yLabel.scale.set(0.4, 0.1, 1)
    this.scene.add(yLabel)

    const zLabel = makeLabel('flux', '#4444ff')
    zLabel.position.set(0.12, 0.12, 1.45)
    zLabel.scale.set(0.4, 0.1, 1)
    this.scene.add(zLabel)

    // Camera — perspective projection, sits on +Z looking at origin
    this.camera = new THREE.PerspectiveCamera(
      60,                                      // field of view in degrees
      window.innerWidth / window.innerHeight,  // aspect ratio
      0.01,                                    // near clip
      100                                      // far clip
    )
    this.camera.position.set(0, 0, 4)
    // Ribbon lives in roughly the -1 to 1 cube at origin.

    // OrbitControls — mouse drag to rotate, scroll to zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true   // smooth inertia on rotation
    this.controls.dampingFactor = 0.05
    this.controls.enablePan    = false   // keep ribbon centered
    this.controls.minDistance  = 1
    this.controls.maxDistance  = 12

    // Resize handler — keeps canvas and camera in sync with window size
    this._onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', this._onResize)
  }
}