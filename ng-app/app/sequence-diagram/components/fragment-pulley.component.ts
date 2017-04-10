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

  public isTop(): Boolean {
    return this.top == 0;
  }

  public isBottom(): Boolean {
    return this.top == 100;
  }

  public isLeft(): Boolean {
    return this.left == 0;
  }

  public isRight(): Boolean {
    return this.left == 100;
  }

}