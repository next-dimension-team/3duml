import { Component, Input, ElementRef, OnChanges } from '@angular/core';
import * as M from '../models';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent implements OnChanges {

  protected VYSKA_HLAVICKY_LAJFLAJNY = 50;
  protected VYSKA_ZUBKU = 40;

  @Input()
  public interactionFragmentModel: M.InteractionFragment;

  protected fragments = [];

  constructor(public element: ElementRef) {
    //
  }

  ngOnChanges() {
    this.fragments = this.r(this.interactionFragmentModel).children;
    console.log("RESULT", this.fragments);
  }

  r(interactionFragmentModel: M.InteractionFragment) {
    // Child
    let children = [];
    for (let child of interactionFragmentModel.children) {
      children.push(this.r(child));
    }

    // Me
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

      console.info("CombinedFragment envelope", envelope);
    }

    // Interaction Operand
    else if (self.type == 'InteractionOperand') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      self.height = (envelope.max - envelope.min) * this.VYSKA_ZUBKU;

      console.info("InteractionOperand envelope", envelope);
    }

    self.children = children;

    return self;
  }

  protected envelopeFragment(interactionFragment: M.InteractionFragment) {
    let e = {
      min: null,
      max: null
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

    else {
      alert("toto by sa nemalo stat");
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
