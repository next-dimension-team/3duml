import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-input-dialog',
  template: `<h2>{{title}}</h2>
      <p>{{message}}</p>
      <md-input-container>
        <input mdInput placeholder="{{placeholder}}" (keyup.enter)="onOk.emit(input.value); dialog.close()" #input>
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