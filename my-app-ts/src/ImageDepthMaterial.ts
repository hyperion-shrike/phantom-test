import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const ImageDepthMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDepthMap: new THREE.Texture(), 
    uDisplacement: 0.5,
  },
  `
    varying vec2 vUv;
    uniform sampler2D uDepthMap;
    uniform float uDisplacement;

    void main() {
      vUv = uv;
      
      vec4 depthValue = texture2D(uDepthMap, uv);
      
      vec3 newPosition = position + normal * depthValue.r * uDisplacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      gl_FragColor = texture2D(uTexture, vUv);
    }
  `
)

extend({ ImageDepthMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      imageDepthMaterial: any
    }
  }
}

export { ImageDepthMaterial }