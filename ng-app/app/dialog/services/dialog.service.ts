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

  public createHelpDialog(title: string, items: Array<any>): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(HelpDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.items = items;
    return dialogRef;
  }

}
