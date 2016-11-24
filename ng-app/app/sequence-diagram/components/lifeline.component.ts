import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'lifeline',
  templateUrl: './lifeline.component.html'
})
export class LifelineComponent implements AfterViewInit {

  @Input()
  public left;

  @Input()
  public title;

  @Input()
  public executions : Array<Object>;


  ngAfterViewInit() {
    //
  }

}