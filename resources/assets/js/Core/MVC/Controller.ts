import { Observer } from '../Observer/Observer';
import { Model } from './Model'; 
import { View } from './View'; 

export abstract class Controller implements Observer {
  public model: Model;
  public view: View;

  constructor(_model: Model) {
    this.model = _model;
    this.model.controller = this;
    this.model.registerObserver(this);
    this.initialize();
    this.update();
  }

  public initialize(): void {
    //
  }

  public update(): void {
    //
  }
}