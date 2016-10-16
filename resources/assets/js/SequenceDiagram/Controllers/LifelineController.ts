import { Controller } from '../../Core/MVC/Controller';
import { LifelineModel } from '../Models/LifelineModel';
import { LifelineView } from '../Views/LifelineView';

export class LifelineController extends Controller {
  public model: LifelineModel;
  public view: LifelineView;

  public initialize(): void {
    this.view = new LifelineView(this);
    this.view.position.z = -20 -10 * this.model.layerNumber;
    this.view.position.x = -50 + 20 * this.model.layerNumber;
    console.log(this.view.position.z);
    this.view.show();
  }
}