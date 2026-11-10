import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import type { Group, Mesh } from 'three'

function Core() {
  const group = useRef<Group>(null)
  const shell = useRef<Mesh>(null)
  const drag = useRef({ active: false, x: 0, y: 0 })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame(({ pointer }, delta) => {
    if (!group.current || !shell.current) return
    if (reducedMotion) return
    const progress = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    if (!drag.current.active) {
      group.current.rotation.y += delta * 0.12
      group.current.rotation.y += (pointer.x * 0.22 + progress * Math.PI * 2 - group.current.rotation.y) * 0.018
      group.current.rotation.x += (-pointer.y * 0.14 + progress * 0.38 - group.current.rotation.x) * 0.018
    }
    shell.current.rotation.z += delta * 0.035
  })

  return <group ref={group} scale={1.12}>
    <mesh ref={shell}
      onPointerDown={(event) => { drag.current.active = true; drag.current.x = event.clientX; drag.current.y = event.clientY; event.stopPropagation() }}
      onPointerUp={() => { drag.current.active = false }}
      onPointerLeave={() => { drag.current.active = false }}
      onPointerMove={(event) => {
        if (!drag.current.active || !group.current) return
        group.current.rotation.y += (event.clientX - drag.current.x) * 0.008
        group.current.rotation.x += (event.clientY - drag.current.y) * 0.008
        drag.current.x = event.clientX
        drag.current.y = event.clientY
      }}>
      <icosahedronGeometry args={[1.18, 5]} />
      <MeshDistortMaterial color="#875fff" emissive="#321d82" emissiveIntensity={0.75} roughness={0.18} metalness={0.48} distort={0.24} speed={1.5} />
    </mesh>
    <mesh scale={1.012}><icosahedronGeometry args={[1.18, 2]} /><meshBasicMaterial color="#9e8aff" wireframe transparent opacity={0.22} /></mesh>
    <mesh rotation={[0.92, 0.28, 0.48]}><torusGeometry args={[1.66, 0.009, 12, 180]} /><meshBasicMaterial color="#22d3ee" transparent opacity={0.9} /></mesh>
    <mesh rotation={[1.15, 0.9, -0.5]}><torusGeometry args={[1.48, 0.006, 10, 160]} /><meshBasicMaterial color="#a18aff" transparent opacity={0.6} /></mesh>
    <mesh position={[1.2, 0.46, 0.72]}><sphereGeometry args={[0.065, 20, 20]} /><meshBasicMaterial color="#fbbf24" /></mesh>
    <mesh position={[-1.42, -0.3, 0.2]}><sphereGeometry args={[0.045, 16, 16]} /><meshBasicMaterial color="#22d3ee" /></mesh>
  </group>
}

export default function HeroScene() {
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return <Canvas dpr={small ? [1, 1.25] : [1, 1.7]} camera={{ position: [0, 0, 5.2], fov: 40 }} gl={{ alpha: true, antialias: !small, powerPreference: 'low-power' }}>
    <ambientLight intensity={0.72} /><pointLight position={[3, 3, 4]} intensity={22} color="#22d3ee" /><pointLight position={[-3, -2, 2]} intensity={18} color="#7c5cff" />
    <Float speed={reducedMotion ? 0 : 1.05} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.3}><Core /></Float>
    {!small && !reducedMotion && <Sparkles count={45} scale={4.5} size={1.7} speed={0.18} color="#a99aff" />}
  </Canvas>
}