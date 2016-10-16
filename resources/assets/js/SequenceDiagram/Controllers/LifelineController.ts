import { Controller } from '../../Core/MVC/Controller';
import { LifelineModel } from '../Models/LifelineModel';

export class LifelineController extends Controller {
  public initialize(model: LifelineModel): void {
    console.log("Lifeline contoller was created. Let's initialize the view ...");
  }

  public update(model: LifelineModel): void {
    console.log("Lifeline model has changed. Let's update the view ...");
  }
}