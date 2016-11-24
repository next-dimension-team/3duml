import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'execution',
  templateUrl: './execution.component.html'
})
export class ExecutionComponent implements AfterViewInit {

  @Input()
  public height;

  @Input()
  public top;

  ngAfterViewInit() {
    //
  }

}