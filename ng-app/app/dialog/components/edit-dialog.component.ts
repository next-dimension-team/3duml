import { Component, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  template: `
    <h2>{{title}}</h2>
    <div class="input-item" [hidden]="elementType=='combinedFragment'">
    <md-input-container>
      <input
        #input
        mdInput
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        placeholder="{{message}}"
        value="{{element.name}}"
        (keyup.enter)="submitInput(input.value, selectedItem)">
    </md-input-container>
    </div>
    <div *ngIf="elementType=='message'" class="input-item">
      <md-select  placeholder="Enter message type" [(ngModel)]="selectedItem">
        <md-option *ngFor="let item of items" [value]="item">{{item}}</md-option>
      </md-select>
    </div>
    <div *ngIf="elementType=='combinedFragment'" class="input-item">
      <md-select  placeholder="Enter combined fragment operator" [(ngModel)]="selectedItem">
        <md-option *ngFor="let item of fragmentTypes" [value]="item">{{item}}</md-option>
      </md-select>
    </div>
    <div class="input-item">
      <button md-button [disabled]="inputEmpty(input.value)" (click)="submitInput(input.value, selectedItem)"><md-icon>done</md-icon> OK</button>
      <button md-button (click)="onNo.emit(); dialog.close()"><md-icon>close</md-icon> Cancel</button>
    </div>`
})

// treba pridat parameter s tym aka je sprava (ci async alebo sync)
export class EditDialogComponent {

  public messageSort: string;
  public title: string;
  public message: string;
  public element: any;
  onOk = new EventEmitter();
  onNo = new EventEmitter();
  public elementType: string;
  public items = ["synchCall", "asynchCall"];
  public fragmentTypes = ['alt', 'opt', 'par', 'loop', 'critical', 'neg', 'assert', 'strict', 'seq', 'ignore', 'consider'];
  public selectedItem: string;

  inputEmpty(input: string): boolean {

    if (input.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  submitInput(name: string, messageSort: string): void {

    if (this.inputEmpty(name)) {
      return;
    }

    this.onOk.emit({ name: name == " " ? "" : name, messageSort });
    this.dialog.close();
  }

  constructor(public dialog: MdDialogRef<any>, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {

    if (this.elementType == "message") {
      if (this.element.sort == null) {
        this.selectedItem = this.items[0];
      } else {
        this.selectedItem = this.element.sort;
      }
    }

    if (this.elementType == "combinedFragment") {
      if (this.element.operator == null) {
        this.selectedItem = this.fragmentTypes[0];
      } else {
        this.selectedItem = this.element.operator;
      }
    }


    this.cdr.detectChanges();
  }

}