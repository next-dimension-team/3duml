import * as THREE from 'three';
import { App } from '../../Application';
import { Model } from '../../Core/MVC/Model';
import { View } from '../../Core/MVC/View';
import { Controller } from '../../Core/MVC/Controller';
import { LifelineController } from '../Controllers/LifelineController';

export class LayerView extends View {
  public static readonly LAYERS_GAP: number = 50;
  public static readonly LAYERS_MINIMAL_SIZE = {
    width: 120,
    height: 50,
    depth: 0.5
  };
  public static readonly LAYER_MATERIAL_OPTIONS = {
    color: "#fff",
    side: THREE.DoubleSide,
    opacity: 0.2,
    transparent: true
  };
  public planeObject3D: THREE.Mesh;

  public initialize(): void {
    var planeGeometry = new THREE.BoxGeometry(
      LayerView.LAYERS_MINIMAL_SIZE.width,
      LayerView.LAYERS_MINIMAL_SIZE.height,
      LayerView.LAYERS_MINIMAL_SIZE.depth
    );
    var planeMaterial = new THREE.MeshPhongMaterial(LayerView.LAYER_MATERIAL_OPTIONS);
    var object = new THREE.Mesh(planeGeometry, planeMaterial);
    object.position.y += LayerView.LAYERS_MINIMAL_SIZE.height / 2;
    object.receiveShadow = true;
    object.castShadow = true;
    this.add(object);
  }
  }

}