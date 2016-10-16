import { Observer } from '../Observer/Observer';
import { Model } from './Model'; 
import { View } from './View'; 

export abstract class Controller implements Observer {
  public view: View;

  constructor(public model: Model) {
    model.registerObserver(this);
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