import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fragment-pulley',
  templateUrl: './fragment-pulley.component.html'
})
export class FragmentPulleyComponent {

  @Input()
  public fragment: any;

  @Input()
  public left: Number;

  @Input()
  public top: Number;

  get isTop(): Boolean {
    return this.top == 0;
  }

  get isBottom(): Boolean {
    return this.top == 100;
  }

  get isLeft(): Boolean {
    return this.left == 0;
  }

  get isRight(): Boolean {
    return this.left == 100;
  }

}