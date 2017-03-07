import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-interaction-fragment',
  templateUrl: './interaction-fragment.component.html'
})
export class InteractionFragmentComponent {

  @Input()
  public fragment: any;

}
