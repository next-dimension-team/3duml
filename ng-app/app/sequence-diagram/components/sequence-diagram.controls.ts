import * as THREE from 'three';
import * as _ from 'lodash';
let OrbitControls: typeof THREE.OrbitControls = require('three-orbit-controls')(THREE);

/*
 * Class for controling camera of sequence diagram
 */
export class SequenceDiagramControls extends OrbitControls {

  constructor(object, domElement, config: any) {
    super(object, domElement);

    _.assign(this, config);
  }

}
