"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);
/*
 * Class for controling camera of sequence diagram
 */
var SequenceDiagramControls = (function (_super) {
    __extends(SequenceDiagramControls, _super);
    function SequenceDiagramControls(object, domElement, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, mouseScrollingSpeed, minDistanceToTarget) {
        if (minPolarAngle === void 0) { minPolarAngle = 0.25 * Math.PI; }
        if (maxPolarAngle === void 0) { maxPolarAngle = 0.75 * Math.PI; }
        if (minAzimuthAngle === void 0) { minAzimuthAngle = -0.35 * Math.PI; }
        if (maxAzimuthAngle === void 0) { maxAzimuthAngle = 0.35 * Math.PI; }
        if (mouseScrollingSpeed === void 0) { mouseScrollingSpeed = 50; }
        if (minDistanceToTarget === void 0) { minDistanceToTarget = 500; }
        _super.call(this, object, domElement);
        this.minPolarAngle = minPolarAngle;
        this.maxPolarAngle = maxPolarAngle;
        this.minAzimuthAngle = minAzimuthAngle;
        this.maxAzimuthAngle = maxAzimuthAngle;
        this.minDistanceToTarget = minDistanceToTarget;
        this.mouseScrollingSpeed = mouseScrollingSpeed;
        this.enableZoom = false;
        this.domElement.addEventListener('wheel', function (e) {
            this.handleMouseWheel(e);
        }.bind(this), false);
    }
    SequenceDiagramControls.prototype.handleMouseWheel = function (event) {
        var distance = this.target.distanceTo(this.object.position);
        if (event.deltaY < 0 && distance > this.minDistanceToTarget) {
            this.object.position.z -= this.mouseScrollingSpeed;
        }
        else if (event.deltaY > 0) {
            this.object.position.z += this.mouseScrollingSpeed;
        }
        this.update();
    };
    return SequenceDiagramControls;
}(OrbitControls));
exports.SequenceDiagramControls = SequenceDiagramControls;
//# sourceMappingURL=sequence-diagram.controls.js.map