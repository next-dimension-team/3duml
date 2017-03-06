import { Component, Input, ElementRef } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent {

  @Input()
  public model: M.Layer;

  protected messages: any[];

  constructor(public element: ElementRef) {
    this.processMessages();
  }

  protected processMessages() {
    /*
    model
    direction
    type
    title
    length
    top
    left
    */

    

    /*for (let messageModel of interaction.recursiveMessages) {
      let messagePosition = this.resolveMessagePosition(messageModel);

      messages.push({
        id: messageModel.id,
        direction: this.resolveMessageDirection(messageModel),
        type: this.resolveMessageType(messageModel),
        title: messageModel.name,
        length: this.resolveMessageLength(messageModel),
        top: messagePosition.top,
        left: messagePosition.left
      });
    }

    return messages;*/
  }

}
