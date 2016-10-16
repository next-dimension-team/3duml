import * as THREE from 'three';
import { Application } from '../Application';
import { Model } from '../Core/MVC/Model';
import { Controller } from '../Core/MVC/Controller';
import { ProviderInterface } from './Providers/ProviderInterface';
import { Renderable } from '../Core/MVC/Renderable';
import { Destroyable } from '../Core/MVC/Destroyable';
import { LifelineModel } from './Models/LifelineModel';

export class SequenceDiagram implements Renderable, Destroyable {
  protected lifelines: Array<LifelineModel> = [];

  constructor(protected app: Application, protected provider: ProviderInterface) {
    this.lifelines = this.provider.getLifelines();
  }

  public render(): void {
    // Ground
    var groundGeometry = new THREE.BoxGeometry(1000, 1, 1000);
    var groundMaterial = new THREE.MeshPhongMaterial();
    groundMaterial.color.set("#2ecc71");
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -35;
    ground.receiveShadow = true;
    this.app.scene.add(ground);
  }

  public destroy(): void {
    console.log("destroy diagram");
  }
}