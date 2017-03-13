import * as THREE from 'three';
let OrbitControls: typeof THREE.OrbitControls = require('three-orbit-controls')(THREE);

/*
 * Class for controling camera of sequence diagram
 */
export class SequenceDiagramControls extends OrbitControls {

  constructor(object, domElement, minPolarAngle = 0.25 * Math.PI, maxPolarAngle = 0.75 * Math.PI,
              minAzimuthAngle = - 0.35 * Math.PI, maxAzimuthAngle = 0.35 * Math.PI) {
    super(object, domElement);

    this.minPolarAngle = minPolarAngle;
    this.maxPolarAngle = maxPolarAngle;
    this.minAzimuthAngle = minAzimuthAngle;
    this.maxAzimuthAngle = maxAzimuthAngle;
  }

}
