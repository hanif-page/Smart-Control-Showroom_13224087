import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Text } from '@react-three/drei';
// import { div } from 'three/src/nodes/math/OperatorNode.js';
import { useEffect, useRef, forwardRef } from 'react';
import * as THREE from 'three';

const MESH_NAMES = {
    Main_Light_01: 'Main_Light_01',
    Main_TV_01: 'Main_TV_01',
    Main_Roomba_01: 'Main_Roomba_01'
};

function findMeshesInNode(node) {
    const meshes = [];
    if (!node) return meshes;
    if (node.isMesh) meshes.push(node);
    node.traverse((child) => {
        if (child.isMesh && child !== node) meshes.push(child);
    });
    return meshes;
}

function applyToMaterial(mesh, fn) {
  if (!mesh || !mesh.material) return;
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach(fn);
}

const stateMaterialCache = new Map();

function getOrCreateStateMaterial(key, color, emissive, emissiveIntensity) {
    if (!stateMaterialCache.has(key)) {
        stateMaterialCache.set(key, new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity,
        toneMapped: false
        }));
    }
    const mat = stateMaterialCache.get(key);
    mat.emissiveIntensity = emissiveIntensity;
    mat.color.set(color);
    mat.emissive.set(emissive);
    return mat;
}

function CameraFit({ targetRef }){
    const { camera, controls } = useThree();

    useEffect(() => {
        if (!targetRef.current) return;

        const box = new THREE.Box3().setFromObject(targetRef.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Define the base distance
        const baseOffset = new THREE.Vector3(
            size.x * 0.35, 
            size.y * 0.05, // Lifted slightly higher to get a better downward angle
            size.z * 0.35
        );

        // Rotate the offset by 60 degrees around the Y-axis (up/down axis)
        // Three.js uses radians, so convert 60 degrees to radians
        const angleInRadians = (90 * Math.PI) / 180;
        const yAxis = new THREE.Vector3(0, 1, 0);
        baseOffset.applyAxisAngle(yAxis, angleInRadians);

        // Apply the rotated offset to the center of the room
        camera.position.set(
            center.x + baseOffset.x, 
            center.y + baseOffset.y, 
            center.z + baseOffset.z
        );
        
        // Look directly at the center of the room
        camera.lookAt(center);
        
        // Lower the 'near' clipping plane so close objects render correctly
        camera.near = 0.1; 
        
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();

        if (controls) {
            controls.target.copy(center);

            // Calculate the smallest horizontal dimension of the room
            const minHorizontalDim = Math.min(size.x, size.z);
            
            controls.maxDistance = minHorizontalDim * 0.50; // increase it to extend the min view!
            
            // Limit how close the user can zoom in (prevents clipping into center objects)
            controls.minDistance = 0.5;

            controls.update();
        }
    }, [targetRef, camera, controls]);

    return null;
}

const ShowroomModel = forwardRef(function ShowroomModel({ states }, ref) {
    const { scene } = useGLTF('/models/room-new-draco.glb');
    const pointLightRef = useRef();
    const roombaRingRef = useRef();
    const groupRef = useRef();


    useEffect(() => {
                    
        const mainLight01 = scene.getObjectByName(MESH_NAMES.Main_Light_01);
        const isLightOn = states.main_light_01?.power === 'on';
        if(!mainLight01) {
            console.warn(`[Scene3D] Mesh "${MESH_NAMES.Main_Light_01}" not found`);
        }
        else {
            findMeshesInNode(mainLight01).forEach((mesh) => {
                mesh.material = getOrCreateStateMaterial(
                    `light-${mesh.uuid}`,
                    isLightOn ? '#fff4cc' : '#888888',
                    isLightOn ? '#fff4cc' : '#000000',
                    isLightOn ? 3 : 0
                );
            });
        }

        // Main TV 01 Changes: screen turns white
        const mainTV01 = scene.getObjectByName(MESH_NAMES.Main_TV_01);
        const isTVOn = states.main_tv_01?.power === 'on';

        if (!mainTV01) {
            console.warn(`[Scene3D] Mesh "${MESH_NAMES.Main_TV_01}" not found`);
        } 
        else if (mainTV01.material) {
            mainTV01.material.color.set(isTVOn ? '#ffffff' : '#3a3a3a');
            if (!mainTV01.material.emissive) mainTV01.material.emissive = new THREE.Color();
            mainTV01.material.emissive.set(isTVOn ? '#ffffff' : '#000000');
            mainTV01.material.emissiveIntensity = isTVOn ? 0.8 : 0;
        }

        // Main Roomba 01: roomba turns to blue
        const mainRoomba01 = scene.getObjectByName(MESH_NAMES.Main_Roomba_01);
        const isRoombaOn = states.main_roomba_01?.power === 'on';

        if(!mainRoomba01) {
            console.warn(`[Scene3D] Mesh "${MESH_NAMES.Main_Roomba_01}" not found`);
        }
        else {
            findMeshesInNode(mainRoomba01).forEach((mesh) => {
                mesh.material = getOrCreateStateMaterial(
                    `roomba-${mesh.uuid}`,
                    isRoombaOn ? '#004fb5' : '#888888',
                    isRoombaOn ? '#004fb5' : '#3b3b3b',
                    isRoombaOn ? 3 : 0
                );
            });
        }

    }, [states, scene]);

    return <primitive ref={ref} object={scene} />
});

export default function Scene3D({ states }) {
    const modelRef = useRef();

    return (
        <div style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <Canvas camera={{ fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5,10,5]} intensity={0.8} />
                <ShowroomModel states={states} ref={modelRef} />
                {/* <gridHelper args={[10,10]} /> */}
                <OrbitControls makeDefault/>
                <CameraFit targetRef={modelRef} />
            </Canvas> 
        </div>
    );
}

useGLTF.preload('/models/room-new-draco.glb')