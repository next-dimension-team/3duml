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

    // TODO: emove "big points" on fragment intersections

    for (let occurrence of this.lifelineModel.occurrenceSpecifications) {
      occupied.push(occurrence.time);
    }

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

    // Hide useless points
    for (let point of this.points) {
      // Small point
      if (point.time != Math.round(point.time)) {
        if (
          (occupied.indexOf(point.time - 0.5) == -1) &&
          (occupied.indexOf(point.time + 0.5) == -1)
        ) {
          point.hidden = true;
        }
      }
    }
  }

}
