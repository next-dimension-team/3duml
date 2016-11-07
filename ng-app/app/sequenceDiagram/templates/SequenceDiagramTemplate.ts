import * as go from 'gojs';
import { MessagingTool } from './MessagingTool';
import { MessageLink } from './MessageLink';
import { ensureLifelineHeights } from './methods';


const $ = go.GraphObject.make;
export const LINE_PREFIX: number = 20; // vertical starting point in document for all Messages and Activations
export const LINE_SUFFIX: number = 30;  // vertical length beyond the last message time
export const MESSAGE_SPACING: number = 20;  // vertical distance between Messages at different steps
export const ACTIVITY_WIDTH: number = 10;  // width of each vertical activity bar
export const ACTIVITY_START: number = 5;  // height before start message time
export const ACTIVITY_END: number = 5;  // height beyond end message time

export class SequenceDiagramTemplate {

  private sequenceDiagram: go.Diagram;

  constructor(htmlId: string) {
    this.sequenceDiagram =
      $(go.Diagram, htmlId, // must be the ID or reference to an HTML DIV
        {
          initialContentAlignment: go.Spot.Center,
          allowCopy: false,
          linkingTool: $(MessagingTool),  // defined below
          "resizingTool.isGridSnapEnabled": true,
          "draggingTool.gridSnapCellSize": new go.Size(1, MESSAGE_SPACING / 4),
          "draggingTool.isGridSnapEnabled": true,
          // automatically extend Lifelines as Activities are moved or resized
          "SelectionMoved": this.ensureLifelineHeights,
          "PartResized": this.ensureLifelineHeights,
          "undoManager.isEnabled": true
        });

    /*this.sequenceDiagram.addDiagramListener("Modified", function (e) {
      //let button: HTMLInputElement = document.getElementById("SaveButton");
      //if (button) button.disabled = !this.sequenceDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (this.sequenceDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });*/
  
  }

  ensureLifelineHeights() {
  // iterate over all Activities (ignore Groups)

  let max: number;
  let arr: Array<Object>;

  arr = this.sequenceDiagram.model.nodeDataArray;
  max = -1;
  for (var i = 0; i < arr.length; i++) {
    let act: any = arr[i];
    if (act.isGroup) continue;
    max = Math.max(max, act.start + act.duration);
  }
  if (max > 0) {
    // now iterate over only Groups
    for (var i = 0; i < arr.length; i++) {
      let gr: any = arr[i];
      if (!gr.isGroup) continue;
      if (max > gr.duration) {  // this only extends, never shrinks
        this.sequenceDiagram.model.setDataProperty(gr, "duration", max);
      }
    }
  }
}
    
  public getDiagram(){
    return this.sequenceDiagram;
  }


}