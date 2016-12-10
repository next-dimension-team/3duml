import * as THREE from 'three';
var OrbitControls = require('three-orbit-controls')(THREE);

/*
 * Class for controling camera of sequence diagram
 */
export class SequenceDiagramOrbitControls extends OrbitControls {

    minDistanceToTarget: number;
    mouseScrollingSpeed: number;

    constructor(object, domElement, minPolarAngle = 0.25 * Math.PI, maxPolarAngle = 0.75 * Math.PI,
        minAzimuthAngle = - 0.35 * Math.PI, maxAzimuthAngle = 0.35 * Math.PI,
        mouseScrollingSpeed = 50, minDistanceToTarget = 500) {
        super(object, domElement);

        this.minPolarAngle = minPolarAngle;
        this.maxPolarAngle = maxPolarAngle;
        this.minAzimuthAngle = minAzimuthAngle;
        this.maxAzimuthAngle = maxAzimuthAngle;
        this.minDistanceToTarget = minDistanceToTarget;
        this.mouseScrollingSpeed = mouseScrollingSpeed;

        this.enableZoom = false;
        this.domElement.addEventListener('wheel', function (e) { this.handleMouseWheel(e); }.bind(this), false);
    }

    handleMouseWheel(event) {
        var distance = this.target.distanceTo(this.object.position);
        console.log(distance);
        if (event.deltaY < 0 && distance > this.minDistanceToTarget) {
            this.object.position.z -= this.mouseScrollingSpeed;

        } else if (event.deltaY > 0) {
            this.object.position.z += this.mouseScrollingSpeed;
        }
        this.update();
    }
}
