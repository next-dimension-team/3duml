import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-interaction-operand',
  templateUrl: './interaction-operand.component.html'
})
export class InteractionOperandComponent {

  @Input()
  public fragment: any;

}
