import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Interaction, Layer } from '../../sequence-diagram/models';
import { SequenceDiagramService } from '../../sequence-diagram/services';

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

  private sequenceDiagrams: Interaction[];
  private openedSequenceDiagram: Interaction = null;

  constructor(private sequenceDiagramService: SequenceDiagramService) { }

  ngOnInit() {
    this.loadSequenceDiagrams();
  }

  private loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: Interaction[]) => {
        this.sequenceDiagrams = diagrams;

        if (this.sequenceDiagrams.length > 0) {
          // this.openSequenceDiagramHandler(this.sequenceDiagrams[0]);
        }
      }
    );
  }

  private openSequenceDiagramHandler(sequenceDiagram: Interaction) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.openSequenceDiagram.emit(this.openedSequenceDiagram);
  }

   private createLayerHandler(): void {
    if (this.openedSequenceDiagram != null) {
      var layerName = prompt("Zdajte názov plátna");
      this.createLayer.emit(layerName);
    }
  }

  createDiagram(): void {
    // TODO
    console.log('Menu component said: Clicked on "Create Diagram" link');
  }
}
