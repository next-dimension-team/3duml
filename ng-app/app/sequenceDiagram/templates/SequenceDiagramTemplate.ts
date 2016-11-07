import * as go from 'gojs';
import { MessagingTool } from './MessagingTool';
import { Util } from './Util';


const $ = go.GraphObject.make;
const util = new Util();

export const LINE_PREFIX = 20; // vertical starting point in document for all Messages and Activations
export const LINE_SUFFIX = 30;  // vertical length beyond the last message time
export const MESSAGE_SPACING = 20;  // vertical distance between Messages at different steps
export const ACTIVITY_WIDTH = 10;  // width of each vertical activity bar
export const ACTIVITY_START = 5;  // height before start message time
export const ACTIVITY_END = 5;  // height beyond end message time

export class SequenceDiagramTemplate {

  private sequenceDiagramTemplate: go.Diagram;

  constructor(htmlId: string) {
    let self = this;

    let messagingTool = $(MessagingTool);
    messagingTool.setDiagram(this.sequenceDiagramTemplate);

    this.sequenceDiagramTemplate =
      $(go.Diagram, htmlId, // must be the ID or reference to an HTML DIV
        {
          initialContentAlignment: go.Spot.Center,
          allowCopy: false,
          linkingTool: messagingTool,  // defined below
          'resizingTool.isGridSnapEnabled': true,
          'draggingTool.gridSnapCellSize': new go.Size(1, MESSAGE_SPACING / 4),
          'draggingTool.isGridSnapEnabled': true,
          // automatically extend Lifelines as Activities are moved or resized
          'SelectionMoved': function () {
            util.ensureLifelineHeights(self.sequenceDiagramTemplate);
          },
          'PartResized': function () {
            util.ensureLifelineHeights(self.sequenceDiagramTemplate);
          },
          'undoManager.isEnabled': true
        });
  }

  public getTemplate() {
    return this.sequenceDiagramTemplate;
  }
}
