import * as go from 'gojs';
import { ACTIVITY_WIDTH } from './SequenceDiagramTemplate';
import { Util } from './Util';

const util = new Util();

export class MessageLink extends go.Link {

  time: number;

  constructor() {
    super();
    this.time = 0;
  }

  /** @override */
  getLinkPoint(node, port, spot, from, ortho, othernode, otherport) {
    let p = port.getDocumentPoint(go.Spot.Center);
    // let r = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
    //  port.getDocumentPoint(go.Spot.BottomRight));
    let op = otherport.getDocumentPoint(go.Spot.Center);

    let data = this.data;
    let time = data !== null ? data.time : this.time;  // if not bound, assume this has its own 'time' property

    let aw = this.findActivityWidth(node, time);
    let x = (op.x > p.x ? p.x + aw / 2 : p.x - aw / 2);
    let y = util.convertTimeToY(time);
    return new go.Point(x, y);
  };

  findActivityWidth(node, time) {
    let aw = ACTIVITY_WIDTH;
    if (node instanceof go.Group) {
      // see if there is an Activity Node at this point -- if not, connect the link directly with the Group's lifeline
      if (!node.memberParts.any(function (mem) {
        let act = mem.data;
        return (act !== null && act.start <= time && time <= act.start + act.duration);
      })) {
        aw = 0;
      }
    }
    return aw;
  };

  /** @override */
  getLinkDirection(node, port, linkpoint, spot, from, ortho, othernode, otherport) {
    let p = port.getDocumentPoint(go.Spot.Center);
    let op = otherport.getDocumentPoint(go.Spot.Center);
    let right = op.x > p.x;
    return right ? 0 : 180;
  };

  /** @override */
  computePoints() {
    if (this.fromNode === this.toNode) {  // also handle a reflexive link as a simple orthogonal loop
      let data = this.data;
      let time = data !== null ? data.time : this.time;  // if not bound, assume this has its own 'time' property
      let p = this.fromNode.port.getDocumentPoint(go.Spot.Center);
      let aw = this.findActivityWidth(this.fromNode, time);

      let x = p.x + aw / 2;
      let y = util.convertTimeToY(time);
      this.clearPoints();
      this.addPoint(new go.Point(x, y));
      this.addPoint(new go.Point(x + 50, y));
      this.addPoint(new go.Point(x + 50, y + 5));
      this.addPoint(new go.Point(x, y + 5));
      return true;
    } else {
      return super.computePoints.call(this);
    }
  }
}
