import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  template: `<h2>{{title}}</h2>
      <p>{{message}}</p>
      <button md-button (keyup.enter)="onYes.emit();" (click)="onYes.emit(); dialog.close()"><md-icon>done</md-icon> Yes</button>
      <button md-button (click)="onNo.emit(); dialog.close()"><md-icon>close</md-icon> No</button>`
})
export class ConfirmDialogComponent {

  public title: string;
  public message: string;
  onYes = new EventEmitter();
  onNo = new EventEmitter();

  constructor(public dialog: MdDialogRef<any>) { }
}