import { Controller } from '../../Core/MVC/Controller';
import { LayerModel } from '../Models/LayerModel';
import { LayerView } from '../Views/LayerView';

export class LayerController extends Controller {
  public model: LayerModel;
  public view: LayerView;

  public initialize(): void {
    this.view = new LayerView(this);
    this.view.show();
  }

  public update() {
    this.view.position.z = - this.model.depth * LayerView.LAYERS_GAP;
  }
}