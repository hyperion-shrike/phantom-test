import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture, Html, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useState, Suspense } from 'react'
import { useControls } from 'leva'
import { ImageDepthMaterial } from './ImageDepthMaterial'

const IMAGES = [
  {
    name: 'Alien',
    image: '/alien.webp',
    depth: '/alien-depth.png',
  },
  {
    name: 'Gun',
    image: '/handgun.webp',
    depth: '/handgun-depth.png',
  },
  {
    name: 'Timer Relic',
    image: '/relic.webp',
    depth: '/relic-depth.png',
  },
  {
    name: 'New Dawn Relic',
    image: '/relic2.webp',
    depth: '/relic2-depth.png',
  },

  {
    name: 'Sword',
    image: '/sword.webp',
    depth: '/sword-depth.png',
  },
  {
    name: 'Book',
    image: '/book.webp',
    depth: '/book-depth.png',
  },
  {
    name: 'Island',
    image: '/island.webp',
    depth: '/island-depth.png',
  },
  {
    name: 'Tunnel',
    image: '/tunnel.webp',
    depth: '/tunnel-depth.png',
  },
  {
    name: 'Grenade',
    image: '/grenade.webp',
    depth: '/grenade-depth.png',
  }
]

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ color: '#fff', fontFamily: 'monospace', letterSpacing: '2px' }}>
        LOADING_ASSETS... [{Math.round(progress)}%]
      </div>
    </Html>
  )
}

function Scene({ activeImage }: { activeImage: typeof IMAGES[0] }) {
  const [colorMap, depthMap] = useTexture([activeImage.image, activeImage.depth])

  const { displacement, wireframe } = useControls({
    displacement: { value: 2.5, min: 0, max: 5, step: 0.1 },
    wireframe: false
  })

  return (
    <>
      <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 1.5} />
      
      <mesh>
        <planeGeometry args={[5, 5, 256, 256]} />
        <ImageDepthMaterial 
          uTexture={colorMap} 
          uDepthMap={depthMap} 
          uDisplacement={displacement}
          wireframe={wireframe}
        />
      </mesh>

      <EffectComposer enableNormalPass>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={0.01} radius={0.5} />
        <Vignette offset={0.5} darkness={0.6} />
      </EffectComposer>
    </>
  )
}

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ position: 'absolute', top: 30, left: 120, zIndex: 10, pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.05em' }}>
          PHANTOM <span style={{ opacity: 0.5, fontWeight: 'normal' }}>VIEWER // 0.1</span>
        </h1>
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
          WEBGL • STABLE DIFFUSION • MIDAS DEPTH
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '100px', zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)'
      }}>
        {IMAGES.map((item, index) => {
          const isActive = index === selectedIndex
          const isHovered = index === hoveredIndex

          return (
            <div
              key={index}
              className="thumb-btn"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setSelectedIndex(index)}
              style={{
                width: '50px', height: '50px', borderRadius: '50%',
                backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                cursor: 'pointer', position: 'relative',
                border: isActive ? '2px solid #fff' : '2px solid rgba(255,255,255,0.1)',
                transform: (isHovered || isActive) ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
              }}
            >
              <div style={{
                position: 'absolute', left: '70px', top: '50%', transform: `translateY(-50%) translateX(${isHovered ? '0px' : '-10px'})`,
                opacity: isHovered ? 1 : 0, transition: 'all 0.3s',
                color: 'white', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                {item.name}
              </div>
            </div>
          )
        })}
      </div>

      <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#050505']} />
        <Suspense fallback={<Loader />}>
          <Scene activeImage={IMAGES[selectedIndex]} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App