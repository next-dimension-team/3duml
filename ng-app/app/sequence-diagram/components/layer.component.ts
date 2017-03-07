import { Component, Input, ElementRef } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent {

  @Input()
  public interactionFragmentModel: M.InteractionFragment;

  constructor(public element: ElementRef) {
    //
  }

}
