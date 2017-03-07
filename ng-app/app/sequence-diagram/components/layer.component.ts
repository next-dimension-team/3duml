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

    // Interaction
    /*if (self.type == 'Interaction') {
      for (let child of children) {
        child.
      }
    }*/

    // Combined Fragment
    if (self.type == 'CombinedFragment') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      self.width = envelope.width;
      self.left = envelope.mostLeft;
      self.top = (((envelope.minimalTime - 1) * this.VYSKA_ZUBKU) + this.VYSKA_HLAVICKY_LAJFLAJNY);
    }

    // Interaction Operand
    else if (self.type == 'InteractionOperand') {
      let envelope = this.envelopeFragment(interactionFragmentModel);
      self.height = (envelope.height + 2) * this.VYSKA_ZUBKU;
    }

    self.children = children;

    return self;
  }

  protected envelopeFragment(interactionFragment: M.InteractionFragment) {

    // Inicializácia
    let minimalTime = null;
    let maximalTime = null;
    let mostLeft = null;
    let mostRight = null;

    // Prejdeme všetky správy v zadanom kombinovanom fragmente
    for (let message of interactionFragment.recursiveMessages) {

      // Určíme minimálny a maximálny čas
      if (message.sendEvent.time < minimalTime || minimalTime == null) {
        minimalTime = message.sendEvent.time;
      }

      if (message.receiveEvent.time < minimalTime || minimalTime == null) {
        minimalTime = message.receiveEvent.time;
      }

      if (message.sendEvent.time > maximalTime || maximalTime == null) {
        maximalTime = message.sendEvent.time;
      }

      if (message.receiveEvent.time > maximalTime || maximalTime == null) {
        maximalTime = message.receiveEvent.time;
      }

      // Určíme ľavú a pravú hraincu
      let lifelineALeft = message.sendEvent.covered.leftDistance;
      let lifelineBLeft = message.receiveEvent.covered.leftDistance;

      if (lifelineALeft < mostLeft || mostLeft == null) {
        mostLeft = lifelineALeft;
      }

      if (lifelineBLeft < mostLeft || mostLeft == null) {
        mostLeft = lifelineBLeft;
      }

      if (lifelineALeft > mostRight || mostRight == null) {
        mostRight = lifelineALeft;
      }

      if (lifelineBLeft > mostRight || mostRight == null) {
        mostRight = lifelineBLeft;
      }
    }

    // Kontroly
    if (minimalTime == null) {
      console.error('Could not determine minimal time for combined fragment', interactionFragment);
    }
    if (maximalTime == null) {
      console.error('Could not determine maximal time for combined fragment', interactionFragment);
    }
    if (mostLeft == null || mostRight == null) {
      console.error('Could not determine width for combined fragment', interactionFragment);
    }

    // Vytvoríme výsledný objekt
    let envelope = {
      minimalTime: minimalTime,
      maximalTime: maximalTime,
      mostLeft: mostLeft,
      mostRight: mostRight,
      width: mostRight - mostLeft,
      height: maximalTime - minimalTime
    };

    return envelope;
  }

}
