import { Model } from '../../Core/MVC/Model';
import { View } from '../../Core/MVC/View';
import { Controller } from '../../Core/MVC/Controller';
import { LifelineController } from '../Controllers/LifelineController';

export class LifelineView extends View {

  public render(): void {
    console.log("Lifeline rendering...");
  }

}