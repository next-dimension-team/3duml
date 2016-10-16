import * as THREE from 'three';
import { App } from '../../Application';
import { Model } from '../../Core/MVC/Model';
import { View } from '../../Core/MVC/View';
import { Controller } from '../../Core/MVC/Controller';
import { LifelineController } from '../Controllers/LifelineController';

export class LifelineView extends View {

  public initialize(): void {
    var planeGeometry = new THREE.BoxGeometry(20, 10, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({
      color: "#ccc",
      side: THREE.DoubleSide
    });
    var object = new THREE.Mesh(planeGeometry, planeMaterial);
    object.receiveShadow = true;
    object.castShadow = true;
    this.add(object);
  }

}