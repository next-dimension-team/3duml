import { Component, Input } from '@angular/core';

@Component({
  selector: 'lifeline',
  templateUrl: './lifeline.component.html'
})
export class LifelineComponent {

  protected editingTitle = false;

  @Input()
  public left;

  @Input()
  public title;

  @Input()
  public executions : Array<Object>;

  onKeyDown(e) {
    if (e.key == "Enter") {
      this.editingTitle = false;
    }
  }

}