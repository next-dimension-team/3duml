import { Controller } from '../../Core/MVC/Controller';
import { SequenceDiagramView } from '../Views/SequenceDiagramView';
import { SequenceDiagramModel } from '../Models/SequenceDiagramModel';
import { LifelineModel } from '../Models/LifelineModel';
import { LifelineView } from '../Views/LifelineView';
import { LifelineController } from '../Controllers/LifelineController';

export class SequenceDiagramController extends Controller {
  public model: SequenceDiagramModel;
  public view: SequenceDiagramView;
  public lifelines: Array<LifelineController>;

  public initialize(): void {
    this.initializeSequenceDiagram();
	this.initializeLifelines();
    // TODO: initialize another elements of the sequence diagram here
  }
	
	
  protected initializeSequenceDiagram() {
    this.view = new SequenceDiagramView(this);
  }

  protected initializeLifelines() {
    this.lifelines = new Array<LifelineController>();
    for (let lifelineModel of this.model.lifelines) {

	 this.lifelines.push(new LifelineController(lifelineModel));
	 }

  }
}