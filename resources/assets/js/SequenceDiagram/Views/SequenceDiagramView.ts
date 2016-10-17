import * as THREE from 'three';
import { App } from '../../Application';
import { View } from '../../Core/MVC/View';
import { LayerView } from './LayerView';

export class SequenceDiagramView extends View {

  public initialize(): void {
    // Adjust camera
    App.camera.position.y = 25;
    App.camera.position.z = LayerView.LAYERS_GAP - LayerView.LAYERS_MINIMAL_SIZE.depth * 2;

    // Ground
    var groundGeometry = new THREE.BoxGeometry(1000, 1, 1000);
    var groundMaterial = new THREE.MeshPhongMaterial();
    groundMaterial.color.set("#2ecc71");
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    this.add(ground);

    // Light
    var ambientLight = new THREE.AmbientLight("#555"); // soft white light
    this.add(ambientLight);
  }

}