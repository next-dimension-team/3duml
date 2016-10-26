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


//not ok!
/* 

	var button = document.getElementById("layer");
	var i = 0;
	
		if (i <=this.model.layerNumber){
		button.addEventListener("click", function(){
		
		i = i + 1;
		var mod = new LifelineModel();
		mod.layer.depth = i;
		var controller = new LifelineController(mod);
		controller.view.show();
	})
		}*/

