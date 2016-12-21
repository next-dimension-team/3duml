import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fragment',
  templateUrl: './fragment.component.html'
})
export class FragmentComponent {

  @Input()
  public title: string;

  @Input()
  public width: number;

  @Input()
  public top: number;

  @Input()
  public left: number;

  @Input()
  public operands;

}
