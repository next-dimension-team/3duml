import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html'
})
export class MessageComponent implements AfterViewInit {

  @Input()
  public direction : string = "left-to-right";

  @Input()
  public type : string = "sync";

  @Input()
  public title : string;

  @Input()
  public length : number;

  @Input()
  public top : number;

  @Input()
  public left : number;

  ngAfterViewInit() {
    //
  }

}