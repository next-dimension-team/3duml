import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SequenceDiagramService } from '../../sequence-diagram/services';
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

  constructor(private sequenceDiagramService: SequenceDiagramService) { }

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
    //console.log('Menu component said: Clicked on "Create Diagram" link');
    var diagramName = window.prompt("Choose name of new digram", "NewSeqDiagram");

    //console.log(diagramName);
    //vytvorenie noveho diagramu
    this.sequenceDiagramService.createDiagram(diagramName, (interaction: M.InteractionFragment) => {
      console.log("JE TO VYTVORENE");
    });
  }

  private createLayerHandler(): void {
    var layerName = window.prompt("Choose name of new layer", "NewLayer");
    this.createLayer.emit(layerName);
  }

  protected delete() {
    this.sequenceDiagramService.performDelete();
  }
}
