import { Component, Input, ElementRef, OnChanges, OnInit, OnDestroy } from '@angular/core';
import * as M from '../models';
import * as THREE from 'three';
let { Object: CSS3DObject } : { Object: typeof THREE.CSS3DObject } = require('three.css')(THREE);

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

  constructor(protected element: ElementRef) {
    //
  }

  public ngOnInit() {
    this.object = new CSS3DObject(this.element.nativeElement);
  }

  public ngOnDestroy() {
    if (this.object.parent) {
      this.object.parent.remove(this.object);
    }
  }

  public ngOnChanges() {
    this.fragments = this.r(this.interactionFragmentModel).children;
  }

  // TODO: nevykreslovat fragmenty ktore su mimo layeru (top = MAX_INT)

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
      children: [],

      // TODO
      width: null,
      height: null,
      left: null,
      top: null,
    };

    // Combined Fragment
    if (self.type == 'CombinedFragment') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      self.width = 0;
      self.left = 0;
      self.top = (envelope.min * this.VYSKA_ZUBKU) + this.VYSKA_HLAVICKY_LAJFLAJNY;

      for (let childOperand of children) {
        for (let childOperandInteraction of childOperand.children) {
          for (let childOperandInteractionFragments of childOperandInteraction.children) {
            childOperandInteractionFragments.top -= self.top;
          }
        }
      }
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
        if (! e) {
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
        if (! e) {
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
