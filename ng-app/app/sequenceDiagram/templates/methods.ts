import * as go from 'gojs';

import { LINE_PREFIX } from './SequenceDiagramTemplate';
import { LINE_SUFFIX } from './SequenceDiagramTemplate';
import { MESSAGE_SPACING } from './SequenceDiagramTemplate';
import { ACTIVITY_START } from './SequenceDiagramTemplate';
import { ACTIVITY_END } from './SequenceDiagramTemplate';

// time is just an abstract small non-negative integer
// here we map between an abstract time and a vertical position
export function convertTimeToY(t) {
  return t * MESSAGE_SPACING + LINE_PREFIX;
}
export function convertYToTime(y) {
  return (y - LINE_PREFIX) / MESSAGE_SPACING;
}

export function computeActivityHeight(duration) {
  return ACTIVITY_START + duration * MESSAGE_SPACING + ACTIVITY_END;
}

export function backComputeActivityHeight(height) {
  return (height - ACTIVITY_START - ACTIVITY_END) / MESSAGE_SPACING;
}

export function computeLifelineHeight(duration) {
  return LINE_PREFIX + duration * MESSAGE_SPACING + LINE_SUFFIX;
}

export function ensureLifelineHeights() {
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

export function computeActivityLocation(act) {
  var groupdata = this.sequenceDiagram.model.findNodeDataForKey(act.group);
  if (groupdata === null) return new go.Point();
  // get location of Lifeline's starting point
  var grouploc = go.Point.parse(groupdata.loc);

  return new go.Point(grouploc.x, convertTimeToY(act.start) - ACTIVITY_START);
}

export function backComputeActivityLocation(loc, act) {
  this.sequenceDiagram.model.setDataProperty(act, "start", convertYToTime(loc.y + ACTIVITY_START));
}