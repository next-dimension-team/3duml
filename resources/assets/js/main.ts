import { App } from './Application';
import { Container } from 'typescript-ioc';
import { DummyProvider as SequenceDiagramProvider } from './SequenceDiagram/Providers/DummyProvider';
import { SequenceDiagramModel } from './SequenceDiagram/Models/SequenceDiagramModel';
import { SequenceDiagramController } from './SequenceDiagram/Controllers/SequenceDiagramController';

// TODO: use SequenceDiagramProvider implementation to get data
import { LayerModel } from './SequenceDiagram/Models/LayerModel';
import { LifelineModel } from './SequenceDiagram/Models/LifelineModel';

function provideSequenceDiagramModel(): SequenceDiagramModel {
  var sequenceDiagramModel: SequenceDiagramModel = new SequenceDiagramModel;

  // Create layers
  sequenceDiagramModel.layers = [];
  for (let i = 0; i < 3; i++) {
    let layerModel = new LayerModel();
    layerModel.depth = i;
    sequenceDiagramModel.layers.push(layerModel);
  }

  // Create lifelines
  sequenceDiagramModel.lifelines = [];
  for (let i = 0; i < 3; i++) {
    let lifelineModel = new LifelineModel();
    lifelineModel.name = "Lifeline " + i;
    lifelineModel.layer = sequenceDiagramModel.layers[i];
    sequenceDiagramModel.lifelines.push(lifelineModel);
  }

  return sequenceDiagramModel;
}

// Compose sequence diagram
var model: SequenceDiagramModel = provideSequenceDiagramModel();
var sequenceDiagram: SequenceDiagramController = new SequenceDiagramController(model);
sequenceDiagram.view.show();
