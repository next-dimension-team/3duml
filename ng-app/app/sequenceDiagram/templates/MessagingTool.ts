import * as go from 'gojs';
import { convertYToTime } from './methods';
import { ensureLifelineHeights } from './methods';
import { MessageLink } from './MessageLink';

const LINE_PREFIX: number = 20; // vertical starting point in document for all Messages and Activations
const LINE_SUFFIX: number = 30;  // vertical length beyond the last message time
const MESSAGE_SPACING: number = 20;  // vertical distance between Messages at different steps
const ACTIVITY_WIDTH: number = 10;  // width of each vertical activity bar
const ACTIVITY_START: number = 5;  // height before start message time
const ACTIVITY_END: number = 5;  // height beyond end message time

// a custom LinkingTool that fixes the "time" (i.e. the Y coordinate)
// for both the temporaryLink and the actual newly created Link
export class MessagingTool extends go.LinkingTool {

  temporaryLink: any;

  constructor() {
    super();

    let $ = go.GraphObject.make;
    this.temporaryLink =
      $(MessageLink,
        $(go.Shape, "Rectangle",
          { stroke: "magenta", strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: "OpenTriangle", stroke: "magenta" }));
  }


  /** @override */
  doActivate() {
    go.LinkingTool.prototype.doActivate.call(this);
    var time = convertYToTime(this.diagram.firstInput.documentPoint.y);
    let temporaryLink: any;
    this.temporaryLink.time = Math.ceil(time);  // round up to an integer value
  };

  /** @override */
  insertLink(fromnode, fromport, tonode, toport) {
    var newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
    if (newlink !== null) {
      var model = this.diagram.model;
      // specify the time of the message
      var start = this.temporaryLink.time;
      var duration = 1;
      newlink.data.time = start;
      model.setDataProperty(newlink.data, "text", "msg");
      // and create a new Activity node data in the "to" group data
      var newact = {
        group: newlink.data.to,
        start: start,
        duration: duration
      };
      model.addNodeData(newact);
      // now make sure all Lifelines are long enough
      ensureLifelineHeights();
    }
    return newlink;
  };
  // end MessagingTool

}



