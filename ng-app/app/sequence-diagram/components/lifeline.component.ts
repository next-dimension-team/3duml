import { Component, Input, OnInit } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-lifeline',
  templateUrl: './lifeline.component.html'
})
export class LifelineComponent implements OnInit {

  @Input()
  public lifelineModel: M.Lifeline;

  @Input()
  public left: number;

  protected points;

  ngOnInit() {
    // Get the occupied occurence specifications
    let occupied = [];

    for (let occurrence of this.lifelineModel.occurrenceSpecifications) {
      occupied.push(occurrence.time);
    }

    console.log(occupied);

    // TODO: tam kde je occurrence nevyreslovat gulicku
    // TODO: tahat z configu kolko je guliciek
    let times_max = 20;
    this.points = [];
    for (let time = 0.5; time - 0.5 <= times_max; time = time + 0.5) {
      this.points.push({
        time: time,
        hidden: (occupied.indexOf(time) > -1)
      });
    }
  }

}
