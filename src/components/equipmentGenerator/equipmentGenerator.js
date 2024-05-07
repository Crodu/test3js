import { forwardRef, useEffect, useState } from "react";
import * as THREE from "three";
import EquipmentIcon from "../equipmentsMenu/equipmentIcon/equipmentIcon"
import { useFrame } from "@react-three/fiber";

const EquipmentGenerator = (props, ref) => {

  useFrame(({clock}) => {
    const { equipments } = props;
    const time = clock.elapsedTime/10 % 1;
    if (ref.current) {
      ref.current.children.forEach((equip, i) => {
        if (equip.shouldAnimate) {
          const line = equipments[i].line
          const curve = new THREE.CatmullRomCurve3(line)
          const pos = curve.getPointAt(time)
          equip.position.set(pos.x, pos.y + 0.2, pos.z)
          const tangent = curve.getTangentAt(time).normalize()
          equip.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(tangent.x, 0, tangent.z))
          // console.log(line);
        }
      })
    }
  }, [ref])

  return (
      <group ref={ref} {...props}>
      {props.equipments.map((equip, i) => (
        <EquipmentIcon key={i} 
          position={equip.position} 
          visible={true} 
          scale={[0.1,0.1,0.1]}
          rotation={equip.rotation}
        />
      ))}
      </group>
  )
}

export default forwardRef(EquipmentGenerator);