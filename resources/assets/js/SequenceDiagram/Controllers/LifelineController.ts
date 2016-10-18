import { Controller } from '../../Core/MVC/Controller';
import { LifelineModel } from '../Models/LifelineModel';
import { LifelineView } from '../Views/LifelineView';

export class LifelineController extends Controller {
  public model: LifelineModel;
  public view: LifelineView;

  public initialize(): void {
    this.view = new LifelineView(this);
    this.view.position.z = this.model.layer.view.position.z;
    this.view.position.x = -45;
    this.view.position.y = 40;
    this.view.show();
  }
}