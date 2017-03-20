import { Component, OnInit, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { MdDialog, MdDialogRef } from '@angular/material';
import { InputDialogComponent } from './input-dialog.component';
import * as M from '../../sequence-diagram/models';


@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  @Output()
  public openSequenceDiagram = new EventEmitter;

  @Output()
  public createLayer = new EventEmitter;

  dialogRef: MdDialogRef<any>;

  private sequenceDiagrams: M.Interaction[];
  private openedSequenceDiagram: M.Interaction;

  constructor(private sequenceDiagramService: SequenceDiagramService, public dialog: MdDialog,  public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.loadSequenceDiagrams();
  }

  private loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;
      }
    );
  }

  private openSequenceDiagramHandler(sequenceDiagram: M.Interaction) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.openSequenceDiagram.emit(this.openedSequenceDiagram);
  }

  createDiagram(): void { 
    this.createInputDialog("Creating diagram", "" ,"Enter name of new digram.").componentInstance.onOk.subscribe(result => {
      this.sequenceDiagramService.createDiagram(result);
    })
  }

  private createLayerHandler(): void {
    this.createInputDialog("Creating layer", "" ,"Enter name of new layer.").componentInstance.onOk.subscribe(result => {
      this.createLayer.emit(result);
    })
  }

  protected delete() {
    this.sequenceDiagramService.performDelete();
  }

  // Priklad pre dialog s textom ako vstup
  openInputDialog() {
    this.createInputDialog("Creating layer", "Enter layer name.", "layer name").componentInstance.onOk.subscribe(result => {
      console.log(result);
    })
  }

  public createInputDialog(title?: string, message?: string, placeholder?: string): MdDialogRef<any> {
    let dialogRef: MdDialogRef<any> = this.dialog.open(InputDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.placeholder = placeholder;
    return dialogRef;
  }
}
