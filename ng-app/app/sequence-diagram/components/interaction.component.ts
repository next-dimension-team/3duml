import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html'
})
export class InteractionComponent {

  @Input()
  public interactionModel: M.Interaction;

}
