import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Interaction } from '../../sequence-diagram/models';
import { SequenceDiagramService } from '../../sequence-diagram/services';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  @Output()
  public openSequenceDiagram = new EventEmitter;

  private sequenceDiagrams: Array<Interaction>;
  private openedSequenceDiagram: Interaction;

  constructor(private sequenceDiagramService: SequenceDiagramService) { }

  ngOnInit() {
    this.sequenceDiagrams = this.sequenceDiagramService.sequenceDiagrams;

    // TODO: toto je len pomocné, neskôr to tam asi nebude
    // nacitame prvy dostupny diagram, aby sme zakazdym nemuseli klikat
    if (this.sequenceDiagrams.length > 0) {
      this.openSequenceDiagramHandler(this.sequenceDiagrams[0]);
    }
  }

  openSequenceDiagramHandler(sequenceDiagram: Interaction) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.openSequenceDiagram.emit(this.openedSequenceDiagram);
  }

  createDiagram(): void {
    // TODO
    console.log('Menu component said: Clicked on "Create Diagram" link');
  }

}
