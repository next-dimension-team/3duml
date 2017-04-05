import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  template: `<h2>{{title}}</h2>
      <p>{{message}}</p>
      <md-input-container>
        <input mdInput value="{{placeholder}}" (keyup.enter)="onOk.emit(input.value); dialog.close()" #input>
      </md-input-container>
      <button md-button (click)="onOk.emit(input.value); dialog.close()">OK</button>
      <button md-button (click)="onNo.emit(); dialog.close()"><md-icon>close</md-icon> Cancel</button>`
})
export class EditDialogComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  onOk = new EventEmitter();
  onNo = new EventEmitter();

  constructor( public dialog: MdDialogRef<any>) { }
}