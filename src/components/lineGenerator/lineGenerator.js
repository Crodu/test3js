import { extend } from "@react-three/fiber";
import { useEffect, useState } from "react";

import { Line2 } from 'three/examples/jsm/Addons.js'
import { LineMaterial } from 'three/examples/jsm/Addons.js'
import { LineGeometry } from 'three/examples/jsm/Addons.js'

extend({ Line2, LineMaterial, LineGeometry})

const LineGenerator = ({points, lines}) => {
  const [geometries, setGeometries] = useState([])

  useEffect(() => {
    console.log(lines.length, geometries.length)
    if (lines.length > 1 && geometries.length < lines.length) {
      setGeometries([])
      lines.map((line, i) => {
        const curve = line.reduce((acc, {x, y, z}) => [...acc, x, y, z], []);
        const newGeometry = new LineGeometry();
        newGeometry.setPositions(curve);
        setGeometries((geometries) => [...geometries, newGeometry]);
      })
    }else if (lines.length === 0 && geometries.length > 0) {
      setGeometries([])
    }
  }, [lines, geometries]);

  return (
    lines.length >= 1 && (
      geometries.map((geo, i) => (
      <line2 key={i} 
        geometry={geo} 
        position={[0, 0, 0]} 
        scale={[1, 1, 1]} 
        rotation={[0, 0, 0]}
      >
        <lineMaterial 
          color="purple" 
          lineWidth={1} 
          resolution={[150,150]}
        />
      </line2>
    ))
    )
  );
}

export default LineGenerator;