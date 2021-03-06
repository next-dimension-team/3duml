import { Component, Input } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {

  // Konstantu vytiahnut niekam do konfigu
  protected VZDIALENOST_LAJFLAJN = 400;
  protected SIRKA_LAJFLAJNY = 120; // TOTO musi byt parne cislo delitelne 4 bezo zvysku 120/4 = 30 ez
  protected VYSKA_HLAVICKY_LAJFLAJNY = 50;
  protected VZDIALENOST_OD_VRCHU_MESSAGE_PO_VRCH_CIARY_MESSAGE = 15;
  protected VYSKA_ZUBKU = 40;
  protected temporaryTop: number = null;
  protected temporaryLeft: number = null;
  protected temporaryLength: number = null;
  protected temporaryDirection: string = null;

  @Input()
  public messageModel: M.Message;

  public get top() {
    if (this.temporaryTop) {
      return this.temporaryTop;
    } else {
      let globalOffset = this.VYSKA_HLAVICKY_LAJFLAJNY - this.VZDIALENOST_OD_VRCHU_MESSAGE_PO_VRCH_CIARY_MESSAGE;
      let sendTime = this.messageModel.sendEvent.time;
      let receiveTime = this.messageModel.receiveEvent.time;
      let time = (sendTime < receiveTime) ? sendTime : receiveTime;
      let messageOffset = time * this.VYSKA_ZUBKU;
      return globalOffset + messageOffset;
    }
  }

  public set top(currentTop: number) {
    this.temporaryTop = currentTop;
  }

  // TODO: implementovat logiku
  public get left() {
    if (this.temporaryLeft) {
      return this.temporaryLeft;
    }
    let sourceLifelineOrder = this.messageModel.sendEvent.covered.order;
    let targetLifelineOrder = this.messageModel.receiveEvent.covered.order;
    let firstLifelineOrder = (sourceLifelineOrder < targetLifelineOrder) ? sourceLifelineOrder : targetLifelineOrder;

    let leftOffset = (firstLifelineOrder - 1) * this.VZDIALENOST_LAJFLAJN;
    let lifelineHalfWith = this.SIRKA_LAJFLAJNY / 2;

    return leftOffset + lifelineHalfWith;
  }

  public set left(currentLeft: number) {
    this.temporaryLeft = currentLeft;
  }


  // TODO: implementovat logiku
  public get length() {
    if (this.temporaryLength) {
      return this.temporaryLength;
    }
    let sourceLifelineOrder = this.messageModel.sendEvent.covered.order;
    let targetLifelineOrder = this.messageModel.receiveEvent.covered.order;

    return Math.abs(sourceLifelineOrder - targetLifelineOrder) * this.VZDIALENOST_LAJFLAJN;
  }
  
  public set length(currentLength: number) {
    this.temporaryLength = currentLength;
  }

  // TODO: implementovat logiku
  public get direction() {
    if (this.temporaryDirection) {
      return this.temporaryDirection;
    }
    let sourceLifeline = this.messageModel.sendEvent.covered;
    let targetLifeline = this.messageModel.receiveEvent.covered;

    return (sourceLifeline.order < targetLifeline.order) ? 'left-to-right' : 'right-to-left';
  }

  public set direction(currentDirection: string) {
    this.temporaryDirection = currentDirection;
  }

  public get type() {
    // TODO: podporovat vsetky typy
    switch (this.messageModel.sort) {
      case 'asynchCall': return 'async';
      case 'synchCall': return 'sync';
      default: return 'unknown';
    }
  }
  public get title() {
    return this.messageModel.name;
  }

}
