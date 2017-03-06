import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-combined-fragment',
  templateUrl: './combined-fragment.component.html'
})
export class CombinedFragmentComponent {

  @Input()
  public combinedFragmentModel: M.CombinedFragment;

}
