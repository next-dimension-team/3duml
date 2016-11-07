import * as go from 'gojs';
import { Util } from './Util';

const $ = go.GraphObject.make;
const util = new Util();

export class LifelineTemplate {

  private lifelineTeplate: go.Group;

  constructor() {

    // define the Lifeline Node template.
    this.lifelineTeplate =
      $(go.Group, 'Vertical',
        {
          locationSpot: go.Spot.Bottom,
          locationObjectName: 'HEADER',
          minLocation: new go.Point(0, 0),
          maxLocation: new go.Point(9999, 0),
          selectionObjectName: 'HEADER'
        },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          { name: 'HEADER' },
          $(go.Shape, 'Rectangle',
            {
              fill: $(go.Brush, 'Linear', { 0: '#70A6FF', 1: '#A8C8FF' }),
              stroke: null
            }),
          $(go.TextBlock,
            {
              margin: 5,
              font: '400 10pt Source Sans Pro, sans-serif'
            },
            new go.Binding('text', 'text'))
        ),
        $(go.Shape,
          {
            figure: 'LineV',
            fill: null,
            stroke: 'gray',
            strokeDashArray: [3, 3],
            width: 1,
            alignment: go.Spot.Center,
            portId: '',
            fromLinkable: true,
            fromLinkableDuplicates: true,
            toLinkable: true,
            toLinkableDuplicates: true,
            cursor: 'pointer'
          },
          new go.Binding('height', 'duration', util.computeLifelineHeight))
      );

  }

  public getTemplate() {
    return this.lifelineTeplate;
  }
}
