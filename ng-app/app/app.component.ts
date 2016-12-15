import { Component} from '@angular/core';
import { Interaction } from './sequence-diagram/models';
import { SequenceDiagramService } from './sequence-diagram/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SequenceDiagramService]
})
export class AppComponent {

  protected loaded: boolean = false;

  public openedSequenceDiagram: Interaction;

  constructor(private sequenceDiagramService: SequenceDiagramService) {
    var self = this;
    this.sequenceDiagramService.loadRecords().subscribe(() => {
      self.loaded = true;
    });
  }
  
  openSequenceDiagram(sequenceDiagramModel: Interaction) {
    this.openedSequenceDiagram = sequenceDiagramModel;
  }

}
