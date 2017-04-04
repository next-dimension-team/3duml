import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { InputService } from '../../sequence-diagram/services/input.service';
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
  private openedSequenceDiagramId: string;
  protected editMode: Boolean = false;

  constructor(private sequenceDiagramService: SequenceDiagramService, protected inputService: InputService) {
    //
  }

  public ngOnInit() {
    this.sequenceDiagramService.menuReload$.subscribe(
      () => this.loadSequenceDiagrams()
    );
  }

  protected changeTab(event) {
    this.editMode = (event.tab.textLabel == "Edit");
    this.sequenceDiagramService.setEditMode(this.editMode);
  }

  private loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;
      }
    );
  }

  private openSequenceDiagramHandler(sequenceDiagram: M.Interaction) {
    //this.sequenceDiagramService.setEditMode(false);
    this.openedSequenceDiagramId = sequenceDiagram.id;
    this.openSequenceDiagram.emit(sequenceDiagram);
  }

  createDiagram(): void {
    this.inputService.createInputDialog("Creating diagram", "", "Enter name of new digram.").componentInstance.onOk.subscribe(result => {
      this.sequenceDiagramService.createDiagram(result);
    })
  }

  private createLayerHandler(): void {
    this.inputService.createInputDialog("Creating layer", "", "Enter name of new layer.").componentInstance.onOk.subscribe(result => {
      this.createLayer.emit(result);
    })
  }

  createLifeline(): void {
    this.inputService.createInputDialog("Create lifeline", "", "Enter name of new lifeline").componentInstance.onOk.subscribe(result => {
      this.sequenceDiagramService.createLifeline(result);
    });
  }

  // DELETE
  protected delete() {
    this.sequenceDiagramService.performDelete();
  }
  protected deleteLayer() {
    this.sequenceDiagramService.deleteLayer();
  }

  protected deleteDiagram(sequenceDiagram: M.Interaction) {
    let confirmDialog = this.inputService.createConfirmDialog("Delete diagram", "Do you really want to delete diagram \"" +
      sequenceDiagram.name + "\" ?");
    confirmDialog.componentInstance.onYes.subscribe(result => {
      this.sequenceDiagramService.deleteDiagram(sequenceDiagram);
    });
  }

  // RENAME
  protected renameDiagram(sequenceDiagram : M.Interaction) {
    this.sequenceDiagramService.renameDiagram(sequenceDiagram);
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
