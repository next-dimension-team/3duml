import * as go from 'gojs';
import { LINE_PREFIX } from './SequenceDiagramTemplate';
import { LINE_SUFFIX } from './SequenceDiagramTemplate';
import { MESSAGE_SPACING } from './SequenceDiagramTemplate';

export class Util {

  private static util: Util;

  constructor() {
    if (!Util.util) {
      Util.util = this;
    }
    return Util.util;
  }

  convertTimeToY(t) {
    return t * MESSAGE_SPACING + LINE_PREFIX;
  }
  convertYToTime(y) {
    return (y - LINE_PREFIX) / MESSAGE_SPACING;
  }

  computeLifelineHeight(duration) {
    return LINE_PREFIX + duration * MESSAGE_SPACING + LINE_SUFFIX;
  }

  ensureLifelineHeights(sequenceDiagram: go.Diagram) {
    // iterate over all Activities (ignore Groups)

    let max: number;
    let arr: Array<Object>;

    arr = sequenceDiagram.model.nodeDataArray;
    max = -1;
    for (let i = 0; i < arr.length; i++) {
      let act: any = arr[i];
      if (act.isGroup) {
        continue;
      }
      max = Math.max(max, act.start + act.duration);
    }
    if (max > 0) {
      // now iterate over only Groups
      for (let i = 0; i < arr.length; i++) {
        let gr: any = arr[i];
        if (!gr.isGroup) {
          continue;
        }
        if (max > gr.duration) {  // this only extends, never shrinks
          sequenceDiagram.model.setDataProperty(gr, 'duration', max);
        }
      }
    }
  }
}
