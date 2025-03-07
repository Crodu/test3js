import * as THREE from 'three';

const createSegmentedLine = (terrain, points, minDistance) => {
  const newPoints = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const distance = start.distanceTo(end);
    if (distance > minDistance) {
      const segments = Math.ceil(distance / minDistance);
      const step = 1 / segments;
      const currPoint = start.clone();
      for (let t = step; t < 1; t += step) {
        currPoint.lerpVectors(start, end, t);
        const height = terrain.getHeightAt(currPoint.x, currPoint.z);
        currPoint.y = height + 0.2;
        newPoints.push(currPoint.clone());
      }
      newPoints.push(end);
    }
  }
  return newPoints;
}

export const nearestPointFromLines = (lines, pos) => lines.reduce((nearest, line) => {
  const nearestInLine = line.reduce((nearestInLine, point) => {
    const distance = pos.distanceTo(point);
    if (distance < nearestInLine.distance) {
      return { point, distance, line };
    }
    return nearestInLine;
  }, { point: null, distance: Infinity, line: null });

  if (nearestInLine.distance < nearest.distance) {
    return nearestInLine;
  }
  return nearest;
}, { point: null, distance: Infinity, line: null});

export const nearestMeshFromPoint = (meshes, point) => meshes.reduce((nearest, mesh) => {
  const distance = point.distanceTo(mesh.position);
  if (distance < nearest.distance) {
    return { mesh, distance };
  }
  return nearest;
}, { mesh: null, distance: Infinity });

export default createSegmentedLine;