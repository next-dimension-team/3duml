import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { EditDialogComponent } from '../components/edit-dialog.component';
import { InputDialogComponent } from '../components/input-dialog.component';
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

}