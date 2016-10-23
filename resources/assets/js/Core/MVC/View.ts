import { App } from '../../Application';
import { Object3D } from 'three';
import { Model } from './Model';
import { Controller } from './Controller';

export abstract class View extends Object3D {
  public model: Model;
  public controller: Controller;

  constructor(_controller: Controller) {
    super();
    this.controller = _controller;
    this.model = _controller.model;
    this.model.view = this;
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