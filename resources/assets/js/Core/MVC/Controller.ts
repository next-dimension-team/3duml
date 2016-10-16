import { Observer } from '../Observer/Observer';
import { Model } from './Model'; 

export abstract class Controller implements Observer {
  constructor(protected _model: Model) {
    _model.registerObserver(this);
    this.initialize(_model);
    this.update(_model);
  }

  abstract initialize(model: Model): void;

  abstract update(model: Model): void;
}