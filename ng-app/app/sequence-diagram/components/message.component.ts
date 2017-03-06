import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {

  @Input()
  public model: M.Message;

  @Input()
  public direction: string =  'left-to-right';

  @Input()
  public type: string = 'sync';

  @Input()
  public title: string;

  @Input()
  public length: number;

  @Input()
  public top: number;

  @Input()
  public left: number;

}
