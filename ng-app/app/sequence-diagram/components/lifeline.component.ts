import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-lifeline',
  templateUrl: './lifeline.component.html'
})
export class LifelineComponent {

  @Input()
  public lifelineModel: M.Lifeline;

  @Input()
  public left: number;

}
