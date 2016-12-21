import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-execution',
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
