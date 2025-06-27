import { Suspense, useRef } from 'react'
import { Canvas } from "@react-three/fiber"
import { Environment, PresentationControls, Html, MeshReflectorMaterial, RandomizedLight, AccumulativeShadows } from '@react-three/drei';
import Female from './models/Female';
import AnimatedFemale from './models/AnimatedFemale';
import { Stage } from './Stage';

export function Scene() {
    const modelRef = useRef();

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 20 }} style={{ touchAction: 'none', width: '100%', height: '100%' }}>
                <Suspense fallback={null}>
                    <Stage>
                        <PresentationControls
                            global
                            speed={2.5}
                            polar={[0, 0]}
                            config={{ mass: 2, tension: 400 }}
                            snap={false}>

                            <AnimatedFemale ref={modelRef} />
                            {/* <Female ref={modelRef} /> */}

                            <AccumulativeShadows temporal frames={100} scale={1} alphaTest={0.8} position={[0, 0.04, 0]}>
                                <RandomizedLight amount={8} radius={10} ambient={0.5} position={[2.5, 5, -5]} bias={0.001} />
                            </AccumulativeShadows>
                        </PresentationControls>
                    </Stage>

                    <Html scale={0.1} position={[0.3, 1.3, 1]} transform occlude>
                        <div className="annotation">
                            심장  <span style={{ color: 'red' }}>32.6</span> <span style={{ fontSize: '1.5em' }}>😮</span>
                        </div>
                    </Html>

                    <Html scale={0.1} position={[-0.35, 0.8, 1]} transform occlude>
                        <div className="annotation">
                            대장  <span style={{ color: 'lime' }}>87.3</span> <span style={{ fontSize: '1.5em' }}>😊</span>
                        </div>
                    </Html>


                    <ambientLight intensity={0.5} />
                    <spotLight position={[50, 50, -30]} castShadow />
                    <pointLight position={[-10, -10, -10]} color="white" intensity={3} />
                    <pointLight position={[0, -5, 5]} intensity={0.5} />
                    <directionalLight position={[0, -5, 0]} color="white" intensity={2} />
                    <Environment preset="sunset" background backgroundBlurriness={1} />
                    <fog attach="fog" args={['#a3b2c8', 8, 10]} />
                    <mesh
                        position={[0, 0, 0]}
                        scale={[0.1, 0.1, 0.1]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                        receiveShadow  >
                        <planeGeometry args={[70, 70]} />
                        <MeshReflectorMaterial
                            resolution={1024}
                            mixBlur={1}
                            mixStrength={0.3}
                            depthScale={1}
                            minDepthThreshold={0.8}
                            maxDepthThreshold={1}
                            metalness={0.25}
                            color="#ffffff"
                            roughness={1} />
                    </mesh>
                </Suspense>
            </Canvas>
        </div>
    );
}