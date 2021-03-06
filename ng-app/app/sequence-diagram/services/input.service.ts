import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class InputService {

  /* Available Events: https://www.w3schools.com/jsref/dom_obj_event.asp */

  /* Left Click - The event occurs when the user clicks on an element */
  public leftClick = new EventEmitter;

  public broadcastLeftClick(param: any) {
    this.leftClick.emit(param);
  }

  public onLeftClick(callback: any) {
    this.leftClick.subscribe(callback);
  }

  /* Right Click - The event occurs when the user right-clicks on an element to open a context menu */
  public rightClick = new EventEmitter;

  public broadcastRightClick(param: any) {
    this.rightClick.emit(param);
  }

  public onRightClick(callback: any) {
    this.rightClick.subscribe(callback);
  }

  /* Double Click - The event occurs when the user double-clicks on an element */
  public doubleClick = new EventEmitter;

  public broadcastDoubleClick(param: any) {
    this.doubleClick.emit(param);
  }

  public onDoubleClick(callback: any) {
    this.doubleClick.subscribe(callback);
  }

  /* Mouse Over - The event occurs when the pointer is moved onto an element, or onto one of its children */
  public mouseOver = new EventEmitter;

  public broadcastMouseOver(param: any) {
    this.mouseOver.emit(param);
  }

  public onMouseOver(callback: any) {
    this.mouseOver.subscribe(callback);
  }

  /* Mouse Move - The event occurs when the pointer is moving while it is over an element */
  public mouseMove = new EventEmitter;

  public broadcastMouseMove(param: any) {
    this.mouseMove.emit(param);
  }

  public onMouseMove(callback: any) {
    this.mouseMove.subscribe(callback);
  }

  /* Mouse Down - nebolo to EZ ale vygooglili sme to vdaka dobrym komentom od Mata*/
  public mouseDown = new EventEmitter;

  public broadcastMouseDown(param: any) {
    this.mouseDown.emit(param);
  }

  public onMouseDown(callback: any) {
    this.mouseDown.subscribe(callback);
  }

  /* Mouse UP - lebo ked ides hore tak si TOP TOP a cela skola je EZ*/
  public mouseUp = new EventEmitter;

  public broadcastMouseUp(param: any) {
    this.mouseUp.emit(param);
  }

  public onMouseUp(callback: any) {
    this.mouseUp.subscribe(callback);
  }
}
