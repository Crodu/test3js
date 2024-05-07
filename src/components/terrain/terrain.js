// terrain.js
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import TerrainMesh from './terrainMesh'
import { Bvh, OrbitControls, Sky, Stats } from '@react-three/drei'
import * as THREE from 'three'
import Toolbar from './menu';
import createSegmentedLine from './lineActions';
import LineGenerator from '../lineGenerator/lineGenerator'

const InfinitePlane = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const LoadingScreen = ({visible}) => {
  return (
    visible && (
      <div style={{
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100vw', height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: 'black', 
        color: 'white',
        zIndex: 2,
        }}>
        <h1>Loading...</h1>
      </div>
    )
  );
};

const Terrain = () => {
  const [loading, setLoading] = useState(true)

  const [currentAction, setCurrentAction] = useState('camera')

  const [terrainMesh, setTerrainMesh] = useState(null)

  const [lines, setLines] = useState([])

  const [points, setPoints] = useState([])
  
  const sphere = useRef();
  const controls = useRef();

  useEffect(() => {
    console.log(lines)
  }, [lines])


  const onTerrainClick = (e) => {
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

  const handleToolbarAction = (action) => {
    switch (action) {
      case 'camera':
        controls.current.enabled = true;
        break
      case 'line':
        controls.current.enabled = false;
        break
      case 'button':
        setPoints([])
        setLines([])
        break
      default:
        break
    }
    setCurrentAction(action)
  }

  const handleTerrainLoaded = (meshInfo) => {
    setLoading(false)
    setTerrainMesh(meshInfo)
  }

  return (
    <>
    <LoadingScreen visible={loading} />
    <Toolbar handleAction={handleToolbarAction} />
    <div style={{width:'100vw', height:'100vh'}}>
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
              cursor={sphere}
              onClick={(e) => onTerrainClick(e)}
              onFinishLoading={(mesh) => handleTerrainLoaded(mesh)}
            />
          </Bvh>
        </Suspense>
        <LineGenerator points={points} lines={lines} />
        <mesh raycast={() => null} ref={sphere} visible={false}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="orange" toneMapped={false} />
        </mesh>
      </Canvas>
    </div>
    </>
  )
}

export default Terrain;