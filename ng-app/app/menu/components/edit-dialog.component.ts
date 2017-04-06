import { Component, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-dialog',
  template: `
   <h2>{{title}}</h2>
      <p>{{message}}</p>
      <md-input-container>
        <input mdInput value="{{placeholder}}" (keyup.enter)="submitInput(input.value)" #input>
      </md-input-container>
      <button md-button [disabled]="inputEmpty(input.value)" (click)="submitInput(input.value)">OK</button>
      <button md-button (click)="onNo.emit(); dialog.close()"><md-icon>close</md-icon> Cancel</button>`
})

// treba pridat este zmenu spravy na synchronnu a asynchr.
export class EditDialogComponent {

  public title: string;
  public message: string;
  public placeholder: string;
  onOk = new EventEmitter();
  onNo = new EventEmitter();

  inputEmpty(input : string): boolean {

    if (input.length == 0){
      return true;
    } else {
      return false;
    }
  }

  submitInput(input: string): void {

    if (this.inputEmpty(input)) {
      return;
    }
    this.onOk.emit(input); 
    this.dialog.close();
  }
  
  constructor( public dialog: MdDialogRef<any>, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

}