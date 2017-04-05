import { Directive, Input, HostListener } from '@angular/core';
import { InputService } from '../services';

@Directive({
  selector: '[selectable]'
})
export class SelectableDirective {

  @Input('selectable') model: any;

  constructor(protected inputService: InputService) { }

  protected cloneEvent(event) {
    return new event.constructor(event.type, event);
  }

  /* Left Click */
  @HostListener('click', ['$event'])
  protected onLeftClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastLeftClick($event);
  }

  /* Right Click */
  @HostListener('contextmenu', ['$event'])
  protected onRightClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastRightClick($event);
  }

  /* Double Click */
  @HostListener('dblclick', ['$event'])
  protected onDblClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastDoubleClick($event);
  }

  /* Mouse Over */
  @HostListener('mouseover', ['$event'])
  protected onMouseOver($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastMouseOver($event);
  }

  /* Mouse Move */
  @HostListener('mousemove', ['$event'])
  protected onMouseMove($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastMouseMove($event);
  }

  /* Mouse Down */
  @HostListener('mousedown', ['$event'])
  protected onMouseDown($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastMouseDown($event);
  }

  /* Mouse Up */
  @HostListener('mouseup', ['$event'])
  protected onMouseUp($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.inputService.broadcastMouseUp($event);
  }
}
