import * as go from 'gojs';
import { MessageLink } from './MessageLink';

const $ = go.GraphObject.make;

export class MessageLinkTemplate {

  private messageLinkTemplate: go.Link;

  constructor() {

    // define the Message Link template.
    this.messageLinkTemplate =
      $(MessageLink,  // defined below
        { selectionAdorned: true, curviness: 0 },
        $(go.Shape, 'Rectangle',
          { stroke: 'black' }),
        $(go.Shape,
          { toArrow: 'OpenTriangle', stroke: 'black' }),
        $(go.TextBlock,
          {
            font: '400 9pt Source Sans Pro, sans-serif',
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            isMultiline: false,
            editable: true
          },
          new go.Binding('text', 'text').makeTwoWay())
      );
  }

  getTemplate() {
    return this.messageLinkTemplate;
  }
}
