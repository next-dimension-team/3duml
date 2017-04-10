import { ConfigService } from '../../config';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { LayersController } from '../controllers';
import * as M from '../models';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as THREE from 'three';
let { Object: CSS3DObject }: { Object: typeof THREE.CSS3DObject } = require('three.css')(THREE);

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent implements OnChanges, OnInit, OnDestroy {

  public object: THREE.CSS3DObject;

  protected VYSKA_HLAVICKY_LAJFLAJNY = 50;
  protected VYSKA_ZUBKU = 40;

  @Input()
  public interactionFragmentModel: M.InteractionFragment;

  protected fragments = [];

  public lifelineGap: number;

  constructor(
    protected sequenceDiagramService: SequenceDiagramService,
    protected element: ElementRef,
    protected config: ConfigService,
    protected layersController: LayersController
  ) {
    //
  }

  public ngOnInit() {
    this.object = new CSS3DObject(this.element.nativeElement);
    this.lifelineGap = this.config.get('lifeline.gap');
  }

  public ngOnDestroy() {
    if (this.object.parent) {
      this.object.parent.remove(this.object);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    this.fragments = this.r(this.interactionFragmentModel).children;
  }

  public get layerWidth(): number {
    let numberOfLifelines = this.interactionFragmentModel.fragmentable.lifelines.length;
    if (numberOfLifelines > 0) {
      let lifelinesWidth = numberOfLifelines * (this.config.get('lifeline.width'));
      let lifelineGapsWidth = (numberOfLifelines - 1) * (this.config.get('lifeline.gap') - this.config.get('lifeline.width'));
      return lifelinesWidth + lifelineGapsWidth;
    }
  }

  // TODO: nevykreslovat fragmenty ktore su mimo layeru (top = MAX_INT)

  // TODO: tuto metodu nazvat normalne a presunut ju do nejakeho "render controllera" alebp "render servicu"
  // alebo do "fragments.renderer.ts" alebo tak neico

  r(interactionFragmentModel: M.InteractionFragment) {
    // Child
    let children = [];
    for (let child of interactionFragmentModel.children) {
      let childFragment = this.r(child);
      if (childFragment) {
        children.push(childFragment);
      }
    }

    // Self
    let self = {
      type: interactionFragmentModel.fragmentable.constructor.name,
      interactionFragmentModel: interactionFragmentModel,
      model: interactionFragmentModel.fragmentable,
      messages: interactionFragmentModel.recursiveMessagesOneLevel,
      children: [],

      // TODO
      width: null,
      height: null,
      left: null,
      top: null,

      leftmost_lifeline: null,
      rightmost_lifeline: null,

      padding: 0,
    };

    interactionFragmentModel.componentObject = self;

    let leftmost_lifeline: M.Lifeline = null;
    let rightmost_lifeline: M.Lifeline = null;

    for (let child of children) {
      if (!leftmost_lifeline || child.leftmost_lifeline.order < leftmost_lifeline.order) {
        leftmost_lifeline = child.leftmost_lifeline;
      }
      
      if (!rightmost_lifeline || child.leftmost_lifeline.order > rightmost_lifeline.order) {
        rightmost_lifeline = child.leftmost_lifeline;
      }

      if (!leftmost_lifeline || child.rightmost_lifeline.order < leftmost_lifeline.order) {
        leftmost_lifeline = child.rightmost_lifeline;
      }

      if (!rightmost_lifeline || child.rightmost_lifeline.order > rightmost_lifeline.order) {
        rightmost_lifeline = child.rightmost_lifeline;
      }
    }

    // find out leftmost message
    for (let message of self.messages) {
      let send_lifeline: M.Lifeline = message.sendEvent.covered;
      let receive_lifeline: M.Lifeline = message.receiveEvent.covered;

      if (!leftmost_lifeline || send_lifeline.order < leftmost_lifeline.order) {
        leftmost_lifeline = send_lifeline;
      }
      
      if (!rightmost_lifeline || send_lifeline.order > rightmost_lifeline.order) {
        rightmost_lifeline = send_lifeline;
      }

      if (!leftmost_lifeline || receive_lifeline.order < leftmost_lifeline.order) {
        leftmost_lifeline = receive_lifeline;
      }

      if (!rightmost_lifeline || receive_lifeline.order > rightmost_lifeline.order) {
        rightmost_lifeline = receive_lifeline;
      }
    }

    self.leftmost_lifeline = leftmost_lifeline;
    self.rightmost_lifeline = rightmost_lifeline;

    // propagate padding
    for (let child of children) {
      if (self.leftmost_lifeline == child.leftmost_lifeline || self.rightmost_lifeline == child.rightmost_lifeline) {
        self.padding = Math.max(child.padding, self.padding);
      }
    }

    // Combined Fragment
    if (self.type == 'CombinedFragment') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      
      self.top = (envelope.min * this.VYSKA_ZUBKU) + this.VYSKA_HLAVICKY_LAJFLAJNY;

      for (let childOperand of children) {
        for (let childOperandInteraction of childOperand.children) {
          for (let childOperandInteractionFragments of childOperandInteraction.children) {
            childOperandInteractionFragments.left = 15 + (childOperandInteractionFragments.leftmost_lifeline.order - self.leftmost_lifeline.order) * this.config.get('lifeline.gap');
            childOperandInteractionFragments.top -= self.top;
          }
        }
      }

      self.padding = self.padding + 15;
      self.width = this.config.get('lifeline.gap') * (self.rightmost_lifeline.order - self.leftmost_lifeline.order) + 2 * self.padding;
      self.left = this.config.get('lifeline.width')/2 - self.padding + (self.leftmost_lifeline.order - 1) * this.config.get('lifeline.gap');
    }

    // Interaction Operand
    else if (self.type == 'InteractionOperand') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      self.height = (envelope.max - envelope.min) * this.VYSKA_ZUBKU;
    }

    self.children = children;

    return self;
  }

  protected envelopeFragment(interactionFragment: M.InteractionFragment) {
    let e = {
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER
    };

    let type = interactionFragment.fragmentable.constructor.name;

    if (type == 'Interaction') {
      // Prejdeme všetky správy v zadanom kombinovanom fragmente
      for (let message of interactionFragment.fragmentable.messages) {

        // Určíme minimálny a maximálny čas
        if (message.sendEvent.time < e.min || e.min == null) {
          e.min = message.sendEvent.time;
        }

        if (message.receiveEvent.time < e.min || e.min == null) {
          e.min = message.receiveEvent.time;
        }

        if (message.sendEvent.time > e.max || e.max == null) {
          e.max = message.sendEvent.time;
        }

        if (message.receiveEvent.time > e.max || e.max == null) {
          e.max = message.receiveEvent.time;
        }
      }

      for (let childFragment of interactionFragment.children) {
        let childEnvelope = this.envelopeFragment(childFragment);
        e = this.squeezeEnvelopes(e, childEnvelope);
      }
    }

    else if (type == 'CombinedFragment') {
      e = null;
      for (let childFragment of interactionFragment.children) {
        let childEnvelope = this.envelopeFragment(childFragment);
        if (!e) {
          e = childEnvelope;
        } else {
          e = this.squeezeEnvelopes(e, childEnvelope);
        }
      }
    }

    else if (type == 'InteractionOperand') {
      e = null;
      for (let childFragment of interactionFragment.children) {
        let childEnvelope = this.envelopeFragment(childFragment);
        if (!e) {
          e = childEnvelope;
        } else {
          e = this.squeezeEnvelopes(e, childEnvelope);
        }
      }
      e.min--;
      e.max++;
    }

    return e;
  }

  protected squeezeEnvelopes(a, b) {
    return {
      min: Math.min(a.min, b.min),
      max: Math.max(a.max, b.max)
    };
  }

}
