import { NgFor } from '@angular/common/src/directives/ng_for';
import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-help-dialog',
  template: `<h2 >{{title}}</h2>
      <div
        *ngFor="let item of items"
        class="help-item"
        (mouseout)="dissOutline()"
        (mouseover)="outline(item[2] || null)">
        <p>{{item[0]}}</p>
        <h3>{{item[1]}}</h3>
      </div>
      <button md-button (keyup.enter)="onOk.emit(); dialog.close()" (click)="onOk.emit(); dialog.close()"><md-icon>done</md-icon> Ok</button>`
})
export class HelpDialogComponent {

  public title: string;
  public items: Array<any> = [];
  onOk = new EventEmitter();

  constructor(public dialog: MdDialogRef<any>) { }

  public outline(selector: string) {
    if (!selector) return;
    let elements = document.querySelectorAll(selector);
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      element.classList.add('highlighted');
    }
  }

  public dissOutline() {
    let elements = document.querySelectorAll('.highlighted');
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      element.classList.remove('highlighted');
    }
  }
}