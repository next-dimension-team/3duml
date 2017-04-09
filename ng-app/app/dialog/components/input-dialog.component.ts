import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-input-dialog',
  template: `<h2>{{title}}</h2>
      <p>{{message}}</p>
      <md-input-container>
        <input
        #input
        mdInput
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="{{placeholder}}"
        (keyup.enter)="onOk.emit(input.value); dialog.close()">
      </md-input-container>
      <button md-button (click)="onOk.emit(input.value); dialog.close()">OK</button>`
})
export class InputDialogComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  onOk = new EventEmitter();

  constructor( public dialog: MdDialogRef<any>) { }
}