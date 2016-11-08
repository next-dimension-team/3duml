import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  styleUrls: ['./sequence.diagram.component.css']
})

export class SequenceDiagramComponent implements AfterViewInit {
  
  @ViewChild('diagram') diagramDiv;

  ngAfterViewInit() {
    var $ = go.GraphObject.make;

    var myDiagram =
      $(go.Diagram,
        this.diagramDiv.nativeElement,
        {
          initialContentAlignment: go.Spot.Center,
          "undoManager.isEnabled": true
        }
      );

    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { strokeWidth: 0},
          // Shape.fill is bound to Node.data.color
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );

    // but use the default Link template, by not setting Diagram.linkTemplate
    // create the model data that will be represented by Nodes and Links
    myDiagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);
  }
}
