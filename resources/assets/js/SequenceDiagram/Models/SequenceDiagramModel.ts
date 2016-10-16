import { Model } from '../../Core/MVC/Model';
import { LifelineModel } from './LifelineModel';

export class SequenceDiagramModel extends Model {
  public lifelines: Array<LifelineModel>;
}