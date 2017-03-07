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

  @Input()
  public messageModel: M.Message;

  protected get top() {
    let globalOffset = this.VYSKA_HLAVICKY_LAJFLAJNY - this.VZDIALENOST_OD_VRCHU_MESSAGE_PO_VRCH_CIARY_MESSAGE;
    let sendTime = this.messageModel.sendEvent.time;
    let receiveTime = this.messageModel.receiveEvent.time;
    let time = (sendTime < receiveTime) ? sendTime : receiveTime;
    let messageOffset = time * this.VYSKA_ZUBKU;
    return globalOffset + messageOffset;
  }

  // TODO: implementovat logiku
  protected get left() {
    let sourceLifelineOrder = parseInt(this.messageModel.sendEvent.covered.id);
    let targetLifelineOrder = parseInt(this.messageModel.receiveEvent.covered.id);
    let firstLifelineOrder = (sourceLifelineOrder < targetLifelineOrder) ? sourceLifelineOrder : targetLifelineOrder;

    let leftOffset = (firstLifelineOrder - 1) * this.VZDIALENOST_LAJFLAJN;    
    let lifelineHalfWith = this.SIRKA_LAJFLAJNY / 2;

    return leftOffset + lifelineHalfWith;
  }

  // TODO: implementovat logiku
  protected get length() {
    let sourceLifelineOrder = parseInt(this.messageModel.sendEvent.covered.id);
    let targetLifelineOrder = parseInt(this.messageModel.receiveEvent.covered.id);
    
    return Math.abs(sourceLifelineOrder - targetLifelineOrder) * this.VZDIALENOST_LAJFLAJN;
  }

  // TODO: implementovat logiku
  // NAMIESTO ID TREBA DAT ORDER
  protected get direction() {
    let sourceLifeline = this.messageModel.sendEvent.covered;
    let targetLifeline = this.messageModel.receiveEvent.covered;

    return (sourceLifeline.id < targetLifeline.id) ? 'left-to-right' : 'right-to-left';
  }

  protected get type() {
    // TODO: podporovat vsetky typy
    switch (this.messageModel.sort) {
      case 'asynchCall': return 'async';
      case 'synchCall': return 'sync';
      default: return 'unknown';
    }
  }
  protected get title() {
    return this.messageModel.name;
  }

}
