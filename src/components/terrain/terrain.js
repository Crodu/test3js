// terrain.js
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import TerrainMesh from './terrainMesh'
import { Bvh, OrbitControls, Sky, Stats } from '@react-three/drei'
import * as THREE from 'three'
import Toolbar from './menu';
import createSegmentedLine, { nearestPointFromLines } from './lineActions';
import LineGenerator from '../lineGenerator/lineGenerator'
import LoadingScreen from '../loadingScreen/loadingScreen'
import EquipmentIcon from '../equipmentsMenu/equipmentIcon/equipmentIcon'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import EquipmentGenerator from '../equipmentGenerator/equipmentGenerator'

const InfinitePlane = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const Terrain = () => {
  const [loading, setLoading] = useState(true)

  const [currentAction, setCurrentAction] = useState('camera')

  const [currentCursor, setCurrentCursor] = useState()

  const [terrainMesh, setTerrainMesh] = useState(null)

  const [lines, setLines] = useState([])

  const [points, setPoints] = useState([])

  const [equipments, setEquipments] = useState([])
  
  const sphere = useRef();
  const controls = useRef();
  const equipIconCursor = useRef();
  const equipmentsModels = useRef();

  // useEffect(() => {
  //   console.log(lines)
  // }, [lines])

  const onTerrainClick = (e) => {

    if (currentAction === 'addequip') {
      const { pos } = e;
      const newEquip = {
        position: currentCursor.position.toArray(),
        rotation: currentCursor.rotation.toArray(),
        type: 'excavator'
      }
      setEquipments([...equipments, newEquip])
    }

    if (currentAction === 'line') {
      const { pos } = e;
      if (lines.length >= 1) {
        const segPoints = createSegmentedLine(terrainMesh, [lines[lines.length-1][0], pos], 0.2);
        lines.pop();
        setLines(lines => [...lines, segPoints]);
      }
      setLines(lines => [...lines, [pos]]);      
    }
  }

  const handlePointerMove = (e) => {
    const { pos } = e;
    if (currentAction === 'addequip') {
      const nearestPoint = nearestPointFromLines(lines, pos);
      if (!nearestPoint.point) {
        return;
      }
      if (nearestPoint.point.distanceTo(pos) < 0.8) {
        currentCursor.position.copy(nearestPoint.point);
      }
    }
  }

  const onAddEquip = () => {
    equipIconCursor.current.scale.set(0.1, 0.1, 0.1)
    setCurrentCursor(equipIconCursor.current);
  }

  const handleToolbarAction = (action) => {
    switch (action) {
      case 'camera':
        resetCursor();
        controls.current.enabled = true;
        break
      case 'line':
        resetCursor('purple');
        controls.current.enabled = false;
        break
      case 'addequip':
        controls.current.enabled = false;
        onAddEquip()
        break
      case 'clear':
        onClear();
        break
      default:
        break
    }
    setCurrentAction(action)
  }

  const onClear = (color) => {
    setPoints([]);
    setLines([]);
    setEquipments([]);
    resetCursor(color);
  }

  const resetCursor = (color) => {
    sphere.current.material.color = new THREE.Color(color || 'orange');
    setCurrentCursor(sphere.current);
  }

  const handleTerrainLoaded = (meshInfo) => {
    setLoading(false)
    onClear();
    setTerrainMesh(meshInfo)
  }

  const handleWheel = (e) => {
    if (currentAction === 'addequip') {
      e.stopPropagation();
      currentCursor.rotation.y += e.deltaY * 0.0025;
    } 
  }

  return (
    <>
    <Toolbar handleAction={handleToolbarAction} />
    <LoadingScreen visible={loading} />
    <div style={{width:'100vw', height:'100vh', zIndex: '-1'}}>
      <Canvas>
        <Stats />
        <OrbitControls
          ref={controls}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          // minPolarAngle={Math.PI / 4}
          // maxPolarAngle={Math.PI / 2.3}
          minDistance={20}
          maxDistance={25}
         />
        <pointLight intensity={20000} position={[0, 50, 0]} />
        <Sky sunPosition={[7, 5, 1]} />
        <InfinitePlane />
        <Suspense fallback={null}>
          <Bvh firstHitOnly enabled={true}>
            <TerrainMesh
              cursor={currentCursor}
              onClick={(e) => onTerrainClick(e)}
              onFinishLoading={(mesh) => handleTerrainLoaded(mesh)}
              onPointerMove={(e) => handlePointerMove(e)}
              onWheel={(e) => handleWheel(e)}
            />
          </Bvh>
        </Suspense>
        <LineGenerator points={points} lines={lines} />
        <mesh raycast={() => null} ref={sphere} visible={false}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="orange" toneMapped={false} />
        </mesh>
        <EquipmentIcon ref={equipIconCursor} />
        <EquipmentGenerator equipments={equipments} ref={equipmentsModels} />
      </Canvas>
    </div>
    </>
  )
}

export default Terrain;