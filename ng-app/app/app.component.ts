import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as go from 'gojs';
import { SequenceDiagramTemplate } from '../app/sequenceDiagram/templates/SequenceDiagramTemplate';
import { computeLifelineHeight } from '../app/sequenceDiagram/templates/methods';
import { computeActivityLocation } from '../app/sequenceDiagram/templates/methods';
import { computeActivityHeight } from '../app/sequenceDiagram/templates/methods';
import { backComputeActivityHeight } from '../app/sequenceDiagram/templates/methods';
import { backComputeActivityLocation } from '../app/sequenceDiagram/templates/methods';
import { LINE_PREFIX } from '../app/sequenceDiagram/templates/SequenceDiagramTemplate';
import { ACTIVITY_START } from '../app/sequenceDiagram/templates/SequenceDiagramTemplate';
import { ACTIVITY_WIDTH } from '../app/sequenceDiagram/templates/SequenceDiagramTemplate';
import { MessageLink } from '../app/sequenceDiagram/templates/MessageLink';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('diagram') dragramDiv;

  ngAfterViewInit() {
    var $ = go.GraphObject.make;

    let sequenceDiagramTemplate: SequenceDiagramTemplate = new SequenceDiagramTemplate(this.dragramDiv.nativeElement);
    var myDiagram = sequenceDiagramTemplate.getDiagram();

    /*var myDiagram =
      $(go.Diagram,
        this.dragramDiv.nativeElement,
        {
          initialContentAlignment: go.Spot.Center,
          "undoManager.isEnabled": true
        }
      );*/

    // define the Lifeline Node template.
    myDiagram.groupTemplate =
      $(go.Group, "Vertical",
        {
          locationSpot: go.Spot.Bottom,
          locationObjectName: "HEADER",
          minLocation: new go.Point(0, 0),
          maxLocation: new go.Point(9999, 0),
          selectionObjectName: "HEADER"
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, "Auto",
          { name: "HEADER" },
          $(go.Shape, "Rectangle",
            {
              fill: $(go.Brush, "Linear", { 0: "#70A6FF", 1: "#A8C8FF" }),
              stroke: null
            }),
          $(go.TextBlock,
            {
              margin: 5,
              font: "400 10pt Source Sans Pro, sans-serif"
            },
            new go.Binding("text", "text"))
        ),
        $(go.Shape,
          {
            figure: "LineV",
            fill: null,
            stroke: "gray",
            strokeDashArray: [3, 3],
            width: 1,
            alignment: go.Spot.Center,
            portId: "",
            fromLinkable: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableDuplicates: true,
            cursor: "pointer"
          },
          new go.Binding("height", "duration", computeLifelineHeight))
      );

    // define the Activity Node template
    myDiagram.nodeTemplate =
      $(go.Node,
        {
          locationSpot: go.Spot.Top,
          locationObjectName: "SHAPE",
          minLocation: new go.Point(NaN, LINE_PREFIX - ACTIVITY_START),
          maxLocation: new go.Point(NaN, 19999),
          selectionObjectName: "SHAPE",
          resizable: true,
          resizeObjectName: "SHAPE",
          resizeAdornmentTemplate:
          $(go.Adornment, "Spot",
            $(go.Placeholder),
            $(go.Shape,  // only a bottom resize handle
              {
                alignment: go.Spot.Bottom, cursor: "col-resize",
                desiredSize: new go.Size(6, 6), fill: "yellow"
              })
          )
        },
        new go.Binding("location", "", computeActivityLocation).makeTwoWay(backComputeActivityLocation),
        $(go.Shape, "Rectangle",
          {
            name: "SHAPE",
            fill: "white", stroke: "black",
            width: ACTIVITY_WIDTH,
            // allow Activities to be resized down to 1/4 of a time unit
            minSize: new go.Size(ACTIVITY_WIDTH, computeActivityHeight(0.25))
          },
          new go.Binding("height", "duration", computeActivityHeight).makeTwoWay(backComputeActivityHeight))
      );

    // define the Message Link template.
    myDiagram.linkTemplate =
      $(MessageLink,  // defined below
        { selectionAdorned: true, curviness: 0 },
        $(go.Shape, "Rectangle",
          { stroke: "black" }),
        $(go.Shape,
          { toArrow: "OpenTriangle", stroke: "black" }),
        $(go.TextBlock,
          {
            font: "400 9pt Source Sans Pro, sans-serif",
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            isMultiline: false,
            editable: true
          },
          new go.Binding("text", "text").makeTwoWay())
      );

    //create
    var nodeDataArray = [
      { "key": "Fred", "text": "Fred: Patron", "isGroup": true, "loc": "0 0", "duration": 9 },
      { "key": "Bob", "text": "Bob: Waiter", "isGroup": true, "loc": "100 0", "duration": 9 },
      { "key": "Hank", "text": "Hank: Cook", "isGroup": true, "loc": "200 0", "duration": 9 },
      { "key": "Renee", "text": "Renee: Cashier", "isGroup": true, "loc": "500 0", "duration": 9 },
    ];

    var linkDataArray = [
      { "from": "Fred", "to": "Bob", "text": "order", "time": 1 },
      { "from": "Bob", "to": "Hank", "text": "order food", "time": 2 },
      { "from": "Bob", "to": "Fred", "text": "serve drinks", "time": 3 },
      { "from": "Hank", "to": "Bob", "text": "finish cooking", "time": 5 },
      { "from": "Bob", "to": "Fred", "text": "serve food", "time": 6 },
      { "from": "Fred", "to": "Renee", "text": "pay", "time": 8 }
    ];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  }


}
