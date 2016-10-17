import { Model } from '../../Core/MVC/Model';
import { LayerModel } from './LayerModel';
import { LifelineModel } from './LifelineModel';

export class SequenceDiagramModel extends Model {
  public layers: Array<LayerModel>;
  public lifelines: Array<LifelineModel>;
}