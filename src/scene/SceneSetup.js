/*
 * SceneSetup class initializes the Three.js scene, camera, renderer, and orbit controls.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

  dispose() {
    window.removeEventListener('resize', this._onResize)
    this.controls.dispose()
    this.renderer.dispose()
  }
}