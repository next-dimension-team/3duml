import { App } from '../../Application';
import { Object3D } from 'three';
import { Controller } from './Controller';

export abstract class View extends Object3D {

  constructor(public controller: Controller) {
    super();
    this.initialize();
  }

  public initialize(): void {
    //
  }

  public show() {
    App.scene.add(this);
  }

  public hide(): void {
    App.scene.remove(this);
  }
}