import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input.text.component.html',
  styleUrls: ['./input.text.component.css']
})

export class InputTextComponent {

  @Output()
  public inputTextDiagramName = new EventEmitter;

  @Output()
  public inputTextLayerName = new EventEmitter;

  @Output()
  public inputTextLifelineName = new EventEmitter;

  @Output()
  public inputTextMessageName = new EventEmitter;

  @Input()
  public inputTextType: String;

  @Input()
  public inputTextMessage: String;

  onEnter(value: string) {
    switch (this.inputTextType) {
      case "diagram" :
        this.inputTextDiagramName.emit(value);
        break;
      case "layer" :
        this.inputTextLayerName.emit(value);
        break;
      case "lifeline" :
        this.inputTextLifelineName.emit(value);
        break;
      case "message" :
        this.inputTextMessageName.emit(value);
        break;
    }
  }
}