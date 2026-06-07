/*
 * Ribbon class manages a trail of points in 3D space, visualized as a line in Three.js.
 */

import * as THREE from 'three'
import { CircularBuffer } from '../utils/CircularBuffer.js'

const TRAIL_LENGTH = 300
// 300 frames × ~16ms = ~5 seconds of trail history

export class Ribbon {
  constructor(scene) {

    // Ring buffer — stores last TRAIL_LENGTH (x,y,z) frames
    this.buffer  = new CircularBuffer(TRAIL_LENGTH)

    // Pre-allocated scratch — copyOrderedInto writes here, zero allocation
    this._scratch = new Float32Array(TRAIL_LENGTH * 3)

    // BufferGeometry — allocate full capacity upfront
    this.geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(TRAIL_LENGTH * 3)
    this.posAttr = new THREE.BufferAttribute(positions, 3)
    this.posAttr.setUsage(THREE.DynamicDrawUsage)
    // DynamicDrawUsage — tells GPU this buffer updates every frame,
    // allocates it in memory optimized for frequent writes
    this.geometry.setAttribute('position', this.posAttr)
    this.geometry.setDrawRange(0, 0)
    // Draw nothing until we have real data — prevents drawing
    // uninitialized zeros as a line from origin to origin

    // Line object
    const material = new THREE.LineBasicMaterial({ color: 0xffffff })
    this.line = new THREE.Line(this.geometry, material)
    this.line.frustumCulled = false
    // Disable frustum culling — Three.js would incorrectly hide
    // the ribbon when its bounding box drifts off screen
    scene.add(this.line)
  }

  // Called once per frame. Zero allocation.
  update(x, y, z) {
    this.buffer.push(x, y, z)
    this.buffer.copyOrderedInto(this._scratch)  // ordered, no alloc
    this.posAttr.array.set(this._scratch)       // copy to GPU buffer
    this.posAttr.needsUpdate = true             // flag for re-upload
    this.geometry.setDrawRange(0, this.buffer.count)
  }

  dispose() {
    this.geometry.dispose()
    this.line.material.dispose()
  }
}