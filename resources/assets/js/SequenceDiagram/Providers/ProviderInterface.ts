import { LifelineModel } from '../Models/LifelineModel';

export interface ProviderInterface {
  getLifelines(): Array<LifelineModel>;
}