import { Singleton } from "typescript-ioc";
import { ProviderInterface } from './ProviderInterface';
import { LifelineModel } from '../Models/LifelineModel';

@Singleton
export class DummyProvider implements ProviderInterface {
  public getLifelines(): Array<LifelineModel> {
    var data: Array<LifelineModel> = [];

    for (let i = 1; i <= 5; i++) {
      let lifelineModel = new LifelineModel();
      lifelineModel.name = "Lifeline " + i;
      lifelineModel.layerNumber = i;
      data.push(lifelineModel);
    }

    return data;
  }
}