import { App } from '../../Application';
import { Controller } from '../../Core/MVC/Controller';
import { SequenceDiagramView } from '../Views/SequenceDiagramView';
import { SequenceDiagramModel } from '../Models/SequenceDiagramModel';
import { LayerController } from '../Controllers/LayerController';
import { LifelineModel } from '../Models/LifelineModel';
import { LifelineView } from '../Views/LifelineView';
import { LifelineController } from '../Controllers/LifelineController';
import { LayerView } from '../Views/LayerView';

export class SequenceDiagramController extends Controller {
  public model: SequenceDiagramModel;
  public view: SequenceDiagramView;
  public layers: Array<LayerController>;
  public lifelines: Array<LifelineController>;

  public initialize(): void {
    this.initializeSequenceDiagram();
    this.initializeLayers();
    this.initializeLifelines();
    this.initializeControls();
    // TODO: initialize another elements of the sequence diagram here
  }

  protected initializeSequenceDiagram() {
    this.view = new SequenceDiagramView(this);
  }

  protected initializeLayers() {
    this.layers = new Array<LayerController>();
    
    for (let layerModel of this.model.layers) {
      this.layers.push(new LayerController(layerModel));
    }
  }

  protected initializeLifelines() {
    this.lifelines = new Array<LifelineController>();
    
    for (let lifelineModel of this.model.lifelines) {
      this.lifelines.push(new LifelineController(lifelineModel));
    }
  }

  protected initializeControls() {
    window.document.body.addEventListener('keydown', (e) => {
      var movementStep = 1;
      var rotationStep = 0.1;

      switch (e.keyCode) {
        // Camera rotation
        case 37: // Left arrow
          App.camera.rotateY(rotationStep);
          break;
        case 39: // Right arrow
          App.camera.rotateY(-rotationStep);
          break;

        // Camera movement
        case 87: // W key
          App.camera.position.z -= movementStep;
          break;
        case 83: // S key
          App.camera.position.z += movementStep;
          break;
        case 65: // A key
          App.camera.position.x -= movementStep;
          break;
        case 68: // D key
          App.camera.position.x += movementStep;
          break;
      }
    });

    window.addEventListener('mousewheel', (e) => {
      if (e.wheelDeltaY > 0)
        // Scroll up
        App.camera.position.z -= LayerView.LAYERS_GAP / 10;
      else
        // Scroll down
        App.camera.position.z += LayerView.LAYERS_GAP / 10;
    });
  }
}