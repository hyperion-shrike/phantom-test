
npm install
npm run dev


Technical Architecture

Time Spent: ~4 Hours

Pipeline

Stable Diffusion (RGB) → MiDaS (Depth Map) → WebGL (Vertex Displacement).

Stack

Frontend: React 19, TypeScript, Vite.

3D Engine: React Three Fiber (Three.js).

Shader: Custom GLSL ShaderMaterial + Post-processing (Bloom).

Implementation

Vertex Shader: Samples depth texture at uv to displace position.z.

Fragment Shader: Maps RGB texture to the deformed geometry.

UI: Leva controls for displacement intensity and wireframe debug.

Limitations

Occlusion: 2D-to-3D projection creates stretching artifacts on object sides.

Lighting: Baked image lighting conflicts with dynamic 3D scene lights.

Mobile: Bloom pass is GPU-intensive.

Future Improvements

Server-Side: AWS Lambda + ONNX for live depth generation.

Inpainting: AI generation to fill  and fix stretching.