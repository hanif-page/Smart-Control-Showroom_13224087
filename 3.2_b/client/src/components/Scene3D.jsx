import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { div } from 'three/src/nodes/math/OperatorNode.js';

function DeviceBox({ position, label, isOn }) {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial 
                    color={isOn ? "22c55e" : "#94a3b8"}
                    emissive={isOn ? '#22c55e' : '#000000'}
                    emissiveIntensity={isOn ? 0.6 : 0}
                />
            </mesh>
            <Text position={[0,1,0]} fontSize={0.25} color="black" anchorX="center">
                {label}
            </Text>
        </group>
    );
}

export default function Scene3D({ states }) {
    return (
        <div style={{ height: '200px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [4,4,6], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5,10,5]} intensity={1} />

                <DeviceBox
                    position={[-3,0,0]}
                    label="Room Light 01"
                    isOn={states.room_light01?.power === 'on'}
                />
                <DeviceBox
                    position={[0,0,0]}
                    // label="Main AC 01"
                    label={`Main AC 01 ${(states.main_ac01?.power === 'on') ? `(${states.main_ac01?.temp}° C)` : ""}`}
                    isOn={states.main_ac01?.power === 'on'}
                />
                <DeviceBox
                    position={[3,0,0]}
                    label="Roomba Cleaner 01"
                    isOn={states.roomba01?.power === 'on'}
                />

                <gridHelper args={[10,10]} />
                <OrbitControls />
            </Canvas> 
        </div>
    );
}