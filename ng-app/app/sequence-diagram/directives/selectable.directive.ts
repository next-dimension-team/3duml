import { Directive, Input, HostListener } from '@angular/core';
import { SelectableService } from '../services';

@Directive({
  selector: '[selectable]'
})
export class SelectableDirective {

  @Input('selectable') model: any;

  constructor(protected selectableService: SelectableService) { }

  protected cloneEvent(event) {
    return new event.constructor(event.type, event);
  }

  /* Left Click */
  @HostListener('click', ['$event'])
  protected onLeftClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.selectableService.broadcastLeftClick($event);
  }

  /* Right Click */
  @HostListener('contextmenu', ['$event'])
  protected onRightClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.selectableService.broadcastRightClick($event);
  }

  /* Double Click */
  @HostListener('dblclick', ['$event'])
  protected onDblClick($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.selectableService.broadcastDoubleClick($event);
  }

  /* Mouse Over */
  @HostListener('mouseover', ['$event'])
  protected onMouseOver($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.selectableService.broadcastMouseOver($event);
  }

  /* Mouse Move */
  @HostListener('mousemove', ['$event'])
  protected onMouseMove($event) {
    $event = this.cloneEvent($event);
    $event.model = this.model;
    this.selectableService.broadcastMouseMove($event);
  }
}
