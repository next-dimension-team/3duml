import * as M from './sequence-diagram/models';

import { Component } from '@angular/core';
import { SequenceDiagramComponent } from './sequence-diagram/components/sequence-diagram.component';
import { SequenceDiagramService } from './sequence-diagram/services';
import { StoreResource } from 'ngrx-json-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public openedSequenceDiagram: StoreResource;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService
  ) {
    //
  }

  public openSequenceDiagram(diagram: StoreResource) {
    this.sequenceDiagramService.loadSequenceDiagramTree(diagram).subscribe(
      (interactionFragment: StoreResource) => this.openedSequenceDiagram = interactionFragment
    );
  }
}
