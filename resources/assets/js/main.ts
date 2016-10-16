import { Container } from 'typescript-ioc';
import { DummyProvider as SequenceDiagramProvider } from './SequenceDiagram/Providers/DummyProvider';
import { SequenceDiagramModel } from './SequenceDiagram/Models/SequenceDiagramModel';
import { SequenceDiagramController } from './SequenceDiagram/Controllers/SequenceDiagramController';

// TODO: use SequenceDiagramProvider implementation to get data
function provideSequenceDiagramModel(): SequenceDiagramModel {
  var sequenceDiagramModel: SequenceDiagramModel = new SequenceDiagramModel;
  sequenceDiagramModel.lifelines = Container.get(SequenceDiagramProvider).getLifelines();
  return sequenceDiagramModel;
}

// Compose sequence diagram
var model: SequenceDiagramModel = provideSequenceDiagramModel();
var sequenceDiagramController: SequenceDiagramController = new SequenceDiagramController(model);
sequenceDiagramController.view.show();