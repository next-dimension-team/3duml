import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { InputService } from '../../sequence-diagram/services/input.service';
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

  private sequenceDiagrams: M.Interaction[];
  private openedSequenceDiagram: M.Interaction;
  protected editMode: Boolean;

  constructor( private sequenceDiagramService: SequenceDiagramService, protected inputService: InputService ) { }

  ngOnInit() {
    this.loadSequenceDiagrams();
  }

  protected changeTab(event) {
    this.editMode = (event.tab.textLabel == "Edit");
    this.sequenceDiagramService.setEditMode(true);
  }

  private loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;
      }
    );
  }

  private openSequenceDiagramHandler(sequenceDiagram: M.Interaction) {
    this.sequenceDiagramService.setEditMode(false);
    this.openedSequenceDiagram = sequenceDiagram;
    this.openSequenceDiagram.emit(this.openedSequenceDiagram);
  }


  // CREATE
  createDiagram(): void { 
    this.inputService.createInputDialog("Creating diagram", "" ,"Enter name of new digram.").componentInstance.onOk.subscribe(result => {
      this.sequenceDiagramService.createDiagram(result);
    })
  }

  private createLayerHandler(): void {
    this.inputService.createInputDialog("Creating layer", "" ,"Enter name of new layer.").componentInstance.onOk.subscribe(result => {
      this.createLayer.emit(result);
    })
  }

  createLifeline(): void {
    this.inputService.createInputDialog("Create lifeline", "", "Enter name of new lifeline").componentInstance.onOk.subscribe(result => {
      this.sequenceDiagramService.createLifeline(result, (lifeline: M.Lifeline) => {
      });
    });
  }

  // DELETE
  protected delete() {
    this.sequenceDiagramService.performDelete();
  }

  protected deleteDiagram(sequenceDiagram: M.Interaction) {
    this.sequenceDiagramService.deleteDiagram(sequenceDiagram);
  }

  // TEST
  protected confirmTest() {
    let confirmDialog = this.inputService.createConfirmDialog("Test confirm", "Confirm it");

    confirmDialog.componentInstance.onYes.subscribe(result => {
      console.log("Confirm dialog - YES");
    });

    confirmDialog.componentInstance.onNo.subscribe(result => {
      console.log("Confirm dialog - NO");
    });
  }
}
