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

  protected times;

  constructor() {
    // TODO: tahat z configu kolko je guliciek
    let times_max = 20;
    this.times = [];
    for (let i = 0.5; i - 0.5 <= times_max; i = i + 0.5) {
      this.times.push(i);
    }
  }

}
