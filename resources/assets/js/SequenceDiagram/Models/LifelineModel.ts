import { Model } from '../../Core/MVC/Model';
import { View } from '../../Core/MVC/View';
import { Controller } from '../../Core/MVC/Controller';
import { LayerModel } from './LayerModel';
import { LifelineView } from '../Views/LifelineView';
import { LifelineController } from '../Controllers/LifelineController';

export class LifelineModel extends Model {
  public view: LifelineView;
  public controller: LifelineController;

  public name: string;
  public layer: LayerModel;
}