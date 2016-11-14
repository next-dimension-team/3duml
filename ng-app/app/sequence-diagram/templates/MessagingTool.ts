import * as go from 'gojs';
import { Util } from './Util';
import { MessageLink } from './MessageLink';

const $ = go.GraphObject.make;
const util = new Util();

// a custom LinkingTool that fixes the 'time' (i.e. the Y coordinate)
// for both the temporaryLink and the actual newly created Link
export class MessagingTool extends go.LinkingTool {

  temporaryLink: any;
  sequenceDiagram: go.Diagram;

  constructor() {
    super();

    this.temporaryLink =
      $(MessageLink,
        $(go.Shape, 'Rectangle',
          { stroke: 'magenta', strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: 'OpenTriangle', stroke: 'magenta' }));
  }

  setDiagram(sequenceDiagram: go.Diagram) {
    this.sequenceDiagram = sequenceDiagram;
  }

  /** @override */
  doActivate() {
    go.LinkingTool.prototype.doActivate.call(this);
    let time = util.convertYToTime(this.diagram.firstInput.documentPoint.y);
    this.temporaryLink.time = Math.ceil(time);  // round up to an integer value
  };

  /** @override */
  insertLink(fromnode, fromport, tonode, toport) {
    let newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
    if (newlink !== null) {
      let model = this.diagram.model;
      // specify the time of the message
      let start = this.temporaryLink.time;
      // let duration = 1;
      newlink.data.time = start;
      model.setDataProperty(newlink.data, 'text', 'msg');

      /*// and create a new Activity node data in the 'to' group data
      let newact = {
        group: newlink.data.to,
        start: start,
        duration: duration
      };
      model.addNodeData(newact);
      // now make sure all Lifelines are long enough
      ensureLifelineHeights(this.sequenceDiagram);*/
    }
    return newlink;
  }
}
