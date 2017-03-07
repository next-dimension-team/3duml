import { Component } from '@angular/core';
import * as M from './sequence-diagram/models';
import { SequenceDiagramService } from './sequence-diagram/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SequenceDiagramService]
})
export class AppComponent {

  protected loaded: boolean = false;

  public openedSequenceDiagram: M.InteractionFragment;

  constructor(private service: SequenceDiagramService) {
    this.loaded = true;
  }

  openSequenceDiagram(diagram: M.Interaction) {
    this.service.loadSequenceDiagramTree(diagram).subscribe(
      (interactionFragment: M.InteractionFragment) => this.openedSequenceDiagram = interactionFragment
    );
  }

}
