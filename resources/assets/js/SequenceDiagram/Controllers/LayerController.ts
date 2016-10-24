import { Controller } from '../../Core/MVC/Controller';
import { LayerModel } from '../Models/LayerModel';
import { LayerView } from '../Views/LayerView';

export class LayerController extends Controller {
  public model: LayerModel;
  public view: LayerView;

  public initialize(): void {
    this.view = new LayerView(this);

  }

  public update() {
    this.view.position.z = - this.model.depth * LayerView.LAYERS_GAP;
  }
}

	var button = document.getElementById("layer");
	var i = 0;
	
		button.addEventListener("click", function(){
		var mod = new LayerModel();
		mod.depth = i;
		var controller = new LayerController(mod);
		controller.view.show();
		i = i + 1;
	})
