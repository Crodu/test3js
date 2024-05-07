import { forwardRef } from "react";
import EquipmentIcon from "../equipmentsMenu/equipmentIcon/equipmentIcon"

const EquipmentGenerator = (props, ref) => {
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