import { Model } from '../../Core/MVC/Model';
import { LayerView } from '../Views/LayerView';
import { LayerController } from '../Controllers/LayerController';

export class LayerModel extends Model {
  public view: LayerView;
  public controller: LayerController;

  public depth: number;
}