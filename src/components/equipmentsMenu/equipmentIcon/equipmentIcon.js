import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';

const EquipmentIcon = (props, ref) => {
  const gltf = useGLTF('/tractor.gltf');

  return (
    <mesh raycast={() => null} visible={false} ref={ref} {...props}>
      <primitive object={gltf.scene.clone()} />
    </mesh>
  );
};

export default forwardRef(EquipmentIcon);