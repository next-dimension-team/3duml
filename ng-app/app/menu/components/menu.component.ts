import { DialogService } from '../../dialog/services';
import * as M from '../../sequence-diagram/models';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { InputService } from '../../sequence-diagram/services/input.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  // Events
  @Output() public onOpenSequenceDiagram = new EventEmitter;
  @Output() public onCreateLayer = new EventEmitter;

  constructor(
    protected inputService: InputService,
    protected dialogService: DialogService,
    protected sequenceDiagramService: SequenceDiagramService) {
    //
  }

  // Load sequence diagrams
  protected sequenceDiagrams: M.Interaction[];

  public ngOnInit() {
    this.sequenceDiagramService.menuReload$.subscribe(
      () => this.loadSequenceDiagrams()
    );
  }

  protected loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;
      }
    );
  }

  //  Change "View" and "Edit" mode
  protected editMode: Boolean = false;

  protected changeTab(event) {
    this.editMode = (event.tab.textLabel == 'Edit');
    this.sequenceDiagramService.setEditMode(this.editMode);
  }

  // Open operations
  protected openSequenceDiagram(sequenceDiagram: M.Interaction) {
    this.onOpenSequenceDiagram.emit(sequenceDiagram);
  }

  // Create operations
  protected createDiagram(): void {
    this.dialogService.createInputDialog("Creating diagram", "", "Enter name of new digram.")
      .componentInstance.onOk.subscribe(diagramName => {
        this.sequenceDiagramService.createDiagram(diagramName);
      })
  }

  protected createLayer(): void {
    this.dialogService.createInputDialog("Creating layer", "", "Enter name of new layer.")
      .componentInstance.onOk.subscribe(layerName => {
        this.onCreateLayer.emit(layerName);
      })
  }

  protected createLifeline(): void {
    this.dialogService.createInputDialog("Create lifeline", "", "Enter name of new lifeline")
      .componentInstance.onOk.subscribe(lifelineName => {
        this.sequenceDiagramService.createLifeline(lifelineName);
      });
  }

  // Delete operations
  protected deleteComponent() {
    this.sequenceDiagramService.performDelete();
  }

  protected deleteLayer() {
    this.sequenceDiagramService.deleteLayer();
  }

  protected deleteDiagram(sequenceDiagram: M.Interaction) {
    this.dialogService.createConfirmDialog(
      "Delete diagram", "Do you really want to delete diagram \"" + sequenceDiagram.name + "\" ?").componentInstance.onYes.subscribe((result) => {
        this.sequenceDiagramService.deleteDiagram(sequenceDiagram);
      });
  }

  // Rename operaions
  protected renameDiagram(sequenceDiagram: M.Interaction) {
    this.sequenceDiagramService.renameDiagram(sequenceDiagram);
  }
}
