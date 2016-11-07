import * as go from 'gojs';

import { ACTIVITY_WIDTH } from './SequenceDiagramTemplate';
import { convertTimeToY } from './methods';

export class MessageLink extends go.Link {

  time: number;

  constructor() {
    super();
    
    this.time = 0;
  }

  /** @override */
  getLinkPoint(node, port, spot, from, ortho, othernode, otherport) {
    var p = port.getDocumentPoint(go.Spot.Center);
    var r = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
      port.getDocumentPoint(go.Spot.BottomRight));
    var op = otherport.getDocumentPoint(go.Spot.Center);

    var data = this.data;
    var time = data !== null ? data.time : this.time;  // if not bound, assume this has its own "time" property

    var aw = this.findActivityWidth(node, time);
    var x = (op.x > p.x ? p.x + aw / 2 : p.x - aw / 2);
    var y = convertTimeToY(time);
    return new go.Point(x, y);
  };

  findActivityWidth(node, time) {
    var aw = ACTIVITY_WIDTH;
    if (node instanceof go.Group) {
      // see if there is an Activity Node at this point -- if not, connect the link directly with the Group's lifeline
      if (!node.memberParts.any(function (mem) {
        var act = mem.data;
        return (act !== null && act.start <= time && time <= act.start + act.duration);
      })) {
        aw = 0;
      }
    }
    return aw;
  };

  /** @override */
  getLinkDirection(node, port, linkpoint, spot, from, ortho, othernode, otherport) {
    var p = port.getDocumentPoint(go.Spot.Center);
    var op = otherport.getDocumentPoint(go.Spot.Center);
    var right = op.x > p.x;
    return right ? 0 : 180;
  };

  /** @override */
  computePoints() {
    if (this.fromNode === this.toNode) {  // also handle a reflexive link as a simple orthogonal loop
      var data = this.data;
      var time = data !== null ? data.time : this.time;  // if not bound, assume this has its own "time" property
      var p = this.fromNode.port.getDocumentPoint(go.Spot.Center);
      var aw = this.findActivityWidth(this.fromNode, time);

      var x = p.x + aw / 2;
      var y = convertTimeToY(time);
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