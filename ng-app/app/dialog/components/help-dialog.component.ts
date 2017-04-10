import { Component, EventEmitter } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-help-dialog',
  template: `<h2 >{{title}}</h2>
      <h3>{{messageHeader1}}</h3>
      <p (mouseover)="outline('createDiagram')">{{message1}}</p>
      <h3>{{messageHeader2}}</h3>
      <p>{{message2}}</p>
      <h3>{{messageHeader3}}</h3>
      <p>{{message3}}</p>
      <h3>{{messageHeader4}}</h3>
      <p>{{message4}}</p>
      <h3>{{messageHeader5}}</h3>
      <p>{{message5}}</p>
      <button md-button (keyup.enter)="onOk.emit(); dialog.close()" (click)="onOk.emit(); dialog.close()"><md-icon>done</md-icon> Ok</button>`
})
export class HelpDialogComponent {

  public title: string;
  public messageHeader1: string;
  public message1: string;
  public messageHeader2: string;
  public message2: string;
  public messageHeader3: string;
  public message3: string;
  public messageHeader4: string;
  public message4: string;
  public messageHeader5: string;
  public message5: string;
  onOk = new EventEmitter();

  constructor(public dialog: MdDialogRef<any>) { }

  public outline(id: string) {
    let elements = document.querySelectorAll('[data-help="' + id + '"]');
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      console.log(element);
    }
  }
}