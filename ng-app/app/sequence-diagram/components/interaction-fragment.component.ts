import { Component, Input, OnInit } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-interaction-fragment',
  templateUrl: './interaction-fragment.component.html'
})
export class InteractionFragmentComponent implements OnInit {

  ngOnInit() {
    this.fragment.component = this;
  }

  @Input()
  public fragment: any;
}
