import { Component} from '@angular/core';
import { Interaction } from './sequence-diagram/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public openedSequenceDiagram: Interaction;
  
  openSequenceDiagram(sequenceDiagramModel: Interaction) {
    this.openedSequenceDiagram = sequenceDiagramModel;
  }

}
