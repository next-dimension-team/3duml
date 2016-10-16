import * as THREE from 'three';
import { View } from '../../Core/MVC/View';

export class SequenceDiagramView extends View {

  public initialize(): void {
    // Ground
    var groundGeometry = new THREE.BoxGeometry(1000, 1, 1000);
    var groundMaterial = new THREE.MeshPhongMaterial();
    groundMaterial.color.set("#2ecc71");
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -35;
    ground.receiveShadow = true;
    this.add(ground);

    // Light
    var ambientLight = new THREE.AmbientLight("#555"); // soft white light
    this.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(50, 50, 70);
    pointLight.shadowMapWidth = 4096;
    pointLight.shadowMapHeight = 4096;
    pointLight.castShadow = true;
    this.add(pointLight);
  }

}