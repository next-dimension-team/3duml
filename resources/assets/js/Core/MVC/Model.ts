import { Observable } from '../Observer/Observable';
import { View } from './View';
import { Controller } from './Controller';

export abstract class Model extends Observable {
  public view: View;
  public controller: Controller;
}
