import * as M from './sequence-diagram/models';

import { Component } from '@angular/core';
import { SequenceDiagramComponent } from './sequence-diagram/components/sequence-diagram.component';
import { SequenceDiagramService } from './sequence-diagram/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public openedSequenceDiagram: M.InteractionFragment;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService) {
    //
  }

  public openSequenceDiagram(diagram: M.Interaction) {
    this.sequenceDiagramService.loadSequenceDiagramTree(diagram).subscribe(
      (interactionFragment: M.InteractionFragment) =>
        this.openedSequenceDiagram = interactionFragment
    );
  }
}
