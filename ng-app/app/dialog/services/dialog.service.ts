import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { EditDialogComponent } from '../components/edit-dialog.component';
import { InputDialogComponent } from '../components/input-dialog.component';
import { HelpDialogComponent } from '../components/help-dialog.component';
import { Injectable } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Injectable()
export class DialogService {

  dialogRef: MdDialogRef<any>;

  constructor(public dialog: MdDialog) {
    //
  }

  public createInputDialog(title?: string, message?: string, placeholder?: string): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(InputDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.placeholder = placeholder;
    return dialogRef;
  }

  public createConfirmDialog(title?: string, message?: string): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    return dialogRef;
  }

  public createEditDialog(title?: string, element?: any, message?: string, elementType?: string): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(EditDialogComponent);
    dialogRef.componentInstance.elementType = elementType;
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.element = element;
    return dialogRef;
  }

  public createHelpDialog(title?: string, messageHeader1?: string, message1?: string, messageHeader2?: string, message2?: string, 
      messageHeader3?: string, message3?: string): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(HelpDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.messageHeader1 = messageHeader1;
    dialogRef.componentInstance.message1 = message1;
    dialogRef.componentInstance.messageHeader2 = messageHeader2;
    dialogRef.componentInstance.message2 = message2;
    dialogRef.componentInstance.messageHeader3 = messageHeader3;
    dialogRef.componentInstance.message3 = message3;
    return dialogRef;
  }

}
