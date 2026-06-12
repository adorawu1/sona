# Sona

Real-time 3D audio visualization. Sound becomes a ribbon in space.

## Quick start

```
npm install
npm run dev
```

Open the local URL, click **Start**, allow mic access.

## Controls

| Action | Result |
|---|---|
| Drag | Orbit camera |
| Scroll | Zoom |

## Axes

| Axis | Color | Feature | What it means |
|---|---|---|---|
| X | Red | Brightness | Spectral centroid — where the sonic center of gravity sits |
| Y | Green | Loudness | RMS amplitude — perceptual volume |
| Z | Blue | Flux | Spectral change rate — onset and transition strength |

## Stack

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — mic capture and FFT analysis
- [Three.js](https://threejs.org) — 3D scene and ribbon rendering
- [Vite](https://vitejs.dev) — dev server and build
