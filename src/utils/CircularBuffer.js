/**
 * A buffer that stores the last N audio frames as x,y,z points for the ribbon trail.
 */

export class CircularBuffer {
  constructor(capacity) {
    this.capacity = capacity
    this.data  = new Float32Array(capacity * 3) // x,y,z interleaved
    this.head  = 0  // next write position
    this.count = 0  // valid entries so far
  }

  push(x, y, z) {
    const i = this.head * 3
    this.data[i]     = x
    this.data[i + 1] = y
    this.data[i + 2] = z
    this.head = (this.head + 1) % this.capacity
    if (this.count < this.capacity) this.count++
  }

  // Writes points oldest-first into a pre-allocated target array.
  copyOrderedInto(target) {
    const start = this.count < this.capacity ? 0 : this.head
    for (let i = 0; i < this.count; i++) {
      const src = ((start + i) % this.capacity) * 3
      const dst = i * 3
      target[dst]     = this.data[src]
      target[dst + 1] = this.data[src + 1]
      target[dst + 2] = this.data[src + 2]
    }
  }
}