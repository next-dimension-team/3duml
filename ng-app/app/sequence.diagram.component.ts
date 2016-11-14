import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as go from 'gojs';
import { SequenceDiagramTemplate } from './sequence-diagram/templates/SequenceDiagramTemplate';
import { LifelineTemplate } from './sequence-diagram/templates/LifelineTemplate';
import { MessageLinkTemplate } from './sequence-diagram/templates/MessageLinkTemplate';
import { Datastore } from './Datastore';

@Component({
  selector: 'sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  styleUrls: ['./sequence.diagram.component.css']
})
export class SequenceDiagramComponent implements AfterViewInit {
  @ViewChild('diagram') diagramDiv;

  constructor(private datastore: Datastore) { }

  ngAfterViewInit() {
    let myDiagram: go.Diagram;

    let sequenceDiagram: SequenceDiagramTemplate = new SequenceDiagramTemplate(this.diagramDiv.nativeElement);
    let lifeLine: LifelineTemplate = new LifelineTemplate();
    let messagelink: MessageLinkTemplate = new MessageLinkTemplate();

    myDiagram = sequenceDiagram.getTemplate();
    myDiagram.groupTemplate = lifeLine.getTemplate();
    myDiagram.linkTemplate = messagelink.getTemplate();

    myDiagram.addDiagramListener('Modified', function (e) {
      // let button: HTMLInputElement = document.getElementById('SaveButton');
      // if (button) button.disabled = !this.sequenceDiagram.isModified;
      let idx = window.document.title.indexOf('*');
      if (myDiagram.isModified) {
        if (idx < 0) {
          window.document.title += '*';
        }
      } else {
        if (idx >= 0) {
          window.document.title = window.document.title.substr(0, idx);
        }
      }
    });

    // create
    let nodeDataArray = [
      { 'key': 'Fred', 'text': 'Fred: Patron', 'isGroup': true, 'loc': '0 0', 'duration': 9 },
      { 'key': 'Bob', 'text': 'Bob: Waiter', 'isGroup': true, 'loc': '100 0', 'duration': 9 },
      { 'key': 'Hank', 'text': 'Hank: Cook', 'isGroup': true, 'loc': '200 0', 'duration': 9 },
      { 'key': 'Renee', 'text': 'Renee: Cashier', 'isGroup': true, 'loc': '500 0', 'duration': 9 }
    ];

    let linkDataArray = [
      { 'from': 'Fred', 'to': 'Bob', 'text': 'order', 'time': 1 },
      { 'from': 'Bob', 'to': 'Hank', 'text': 'order food', 'time': 2 },
      { 'from': 'Bob', 'to': 'Fred', 'text': 'serve drinks', 'time': 3 },
      { 'from': 'Hank', 'to': 'Bob', 'text': 'finish cooking', 'time': 5 },
      { 'from': 'Bob', 'to': 'Fred', 'text': 'serve food', 'time': 6 },
      { 'from': 'Fred', 'to': 'Renee', 'text': 'pay', 'time': 8 }
    ];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }
}
