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

  constructor(private sequenceDiagramService: SequenceDiagramService, protected inputService: InputService) { }

  ngOnInit() {
    this.loadSequenceDiagrams();
  }

  private loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;

        if (this.sequenceDiagrams.length > 0) {
          this.openSequenceDiagramHandler(this.sequenceDiagrams[0]);
        }
      }
    );
  }

  private openSequenceDiagramHandler(sequenceDiagram: M.Interaction) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.openSequenceDiagram.emit(this.openedSequenceDiagram);
  }

  createDiagram(): void {
    // TODO
    this.inputService.createInputDialog("Creating diagram", "" ,"Enter name of new digram.").componentInstance.onOk.subscribe(result => {
      let diagramName = result;
      this.sequenceDiagramService.createDiagram(diagramName, (interaction: M.InteractionFragment) => {
        console.log("JE TO VYTVORENE");
      });
    })
  }

  private createLayerHandler(): void {
    this.inputService.createInputDialog("Creating layer", "" ,"Enter name of new layer.").componentInstance.onOk.subscribe(result => {
      this.createLayer.emit(result);
    })
  }

  protected delete() {
    this.sequenceDiagramService.performDelete();
  }

  // Priklad pre dialog s textom ako vstup
  openInputDialog() {
    this.inputService.createInputDialog("Creating layer", "Enter layer name.", "layer name").componentInstance.onOk.subscribe(result => {
      console.log(result);
    })
  }
}
