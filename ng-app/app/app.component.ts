import { Component } from '@angular/core';
import { Interaction } from './sequence-diagram/models';
import { SequenceDiagramService } from './sequence-diagram/services';
import { SequenceDiagramComponent } from './sequence-diagram/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SequenceDiagramService]
})
export class AppComponent {

  protected loaded: boolean = false;

  public openedSequenceDiagram: Interaction;

  constructor(private service: SequenceDiagramService) {
    this.loaded = true;
  }

  openSequenceDiagram(diagram: Interaction) {
    this.service.loadSequenceDiagramTree(diagram).subscribe(
      (interaction: Interaction) => this.openedSequenceDiagram = interaction
    );
  }

  createLayer(sequenceDiagramComponent: SequenceDiagramComponent) {

    
  }

}
