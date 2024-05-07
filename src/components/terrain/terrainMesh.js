import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three'

const TerrainMesh = ({cursor, onFinishLoading, onClick, onWheel, onPointerMove}) => {
  const heightmapTexture = useLoader(TextureLoader, 'heightmap.png');
  const color = useLoader(TextureLoader, 'color.png');
  const normal = useLoader(TextureLoader, 'normal.png');
  const [planeLoaded, setPlaneLoaded] = useState(false);
  const mesh = useRef(null);
  const plane = useRef(null);
  const segs = 64;
  const size = 1024;

  const getCanvasContext = (texture) => {
    const canvas = document.createElement("canvas");
    canvas.width = heightmapTexture.image.width;
    canvas.height = heightmapTexture.image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(heightmapTexture.image, 0, 0, heightmapTexture.image.width, heightmapTexture.image.height);
    return ctx;
  }

  const getTextureParams = (geometry, texture) => {
    const wdth = geometry.parameters.widthSegments + 1;
    const hght = geometry.parameters.heightSegments + 1;
    const widthStep = texture.image.width / wdth;
    const heightStep = texture.image.height / hght;
    return {wdth, hght, widthStep, heightStep}
  }

  useEffect(() => {
    if (mesh.current && !planeLoaded) {
      const plane = mesh.current.geometry;
      displacePlaneInCPU(plane, heightmapTexture);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planeLoaded, heightmapTexture]);

 
  const getHeightAt = (x, z) => {
    const ctx = getCanvasContext(heightmapTexture);
    const width = heightmapTexture.image.width;
    const height = heightmapTexture.image.height;
    const newX = (x + (segs/2)) / segs * width;
    const newZ = (z + (segs/2)) / segs * height;
    const imgData = ctx.getImageData(Math.round(newX), Math.round(newZ), 1, 1).data;
    const displacementVal = (imgData[0] / 255.0) * 5;
    return displacementVal;
  }

  const displacePlaneInCPU = (geometry, texture) => {

    const ctx = getCanvasContext(texture);
    const {wdth, hght, widthStep, heightStep} = getTextureParams(geometry, texture);
  
    for (let h = 0; h < hght; h++) {
      for (let w = 0; w < wdth; w++) {
        const imgData = ctx.getImageData(Math.round(w * widthStep), Math.round(h * heightStep), 1, 1).data;
        const displacementVal = (imgData[0] / 255.0) * 5;
        const idx = (h * wdth) + w;
        geometry.attributes.position.array[idx*3 -1] = displacementVal;
        // vert = displacementVal;
      }
    }
    geometry.verticesNeedUpdate = true;
    // plane.computeFaceNormals();
    setPlaneLoaded(true);
    onFinishLoading({getHeightAt: getHeightAt})
    return geometry
  }

  const handleMouseMove = (e) => {
    mesh.current.worldToLocal(e.point)
    const pos = new THREE.Vector3(e.point.x, e.point.z, -e.point.y);
    cursor.position.copy(pos);
    onPointerMove({...e, pos});
  }

  const handleMouseClick = (e) => {
    mesh.current.worldToLocal(e.point)
    onClick({...e, pos: new THREE.Vector3(e.point.x, e.point.z, -e.point.y)}); 
  }

  const handleWheel = (e) => {
    onWheel(e)
  }

  return (
    <mesh ref={mesh}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e) => handleMouseMove(e)}
      onPointerOver={() => (cursor.visible = true)}
      onPointerOut={() => (cursor.visible = false)}
      onWheel={(e) => handleWheel(e)}
      onClick={(e) => handleMouseClick(e)}
    >
      <planeGeometry ref={plane}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[segs, segs, size, size]}
      />
      <meshStandardMaterial
        attach="material"
        color="white"
        map={color}
        displacementScale={4}
        normalMap={normal}
      />
      
    </mesh>
  );
};

export default TerrainMesh;