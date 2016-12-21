import * as THREE from 'three';
import {
  Component, ViewChild, SimpleChanges, Input, ViewChildren,
  QueryList, AfterViewInit, OnChanges, AfterViewChecked
 } from '@angular/core';
import { SequenceDiagramService } from '../services';
import { LayerComponent } from './layer.component';
import { SequenceDiagramOrbitControls } from './sequence.diagram.orbit.controls';
import * as M from '../models';

const CSS3D = require('three.css')(THREE);

/*
 * Class representing 3D layer
 */
export class Layer extends CSS3D.Object {
  constructor(element: HTMLElement, depth: number) {
    // Create CSS3DObject object
    super(element);

    // Adjust layer position
    this.position.z = -600 * depth;
  }
}

@Component({
  selector: 'app-sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  providers: [SequenceDiagramService]
})
export class SequenceDiagramComponent implements AfterViewInit, OnChanges, AfterViewChecked {

  @ViewChild('scene') sceneDiv;

  // http://stackoverflow.com/questions/40819739/angular-2-template-reference-variable-with-ngfor
  // http://stackoverflow.com/questions/32693061/angular-2-typescript-get-hold-of-an-element-in-the-template/35209681#35209681
  @ViewChildren('layerComponents') layerComponents: QueryList<LayerComponent>;

  protected scene: THREE.Scene;
  protected camera: THREE.Camera;
  protected controls: SequenceDiagramOrbitControls;
  protected renderer: CSS3D.Renderer;
  protected diagramChanged = false;
  protected layerElements = [];

  @Input()
  public rootInteraction: M.Interaction;

  constructor(protected service: SequenceDiagramService) { }

  ngAfterViewChecked() {
    if (this.diagramChanged) {
      this.refreshDiagram();
    }
  }

  protected refreshDiagram() {

    this.diagramChanged = false;
    let layerNum = 0;

    // Odstránime staré vrstvy
    for (let layerElement of this.layerElements) {
      this.scene.remove(layerElement);
    }

    // Pridáme nové vrstvy
    for (let layerComponent of this.layerComponents.toArray()) {
      let element: HTMLElement = layerComponent.element.nativeElement;
      let layer: Layer = new Layer(element, layerNum++);
      this.layerElements.push(layer);
      this.scene.add(layer);
    }
  }

  /*
   * Sleduje zmeny vstupov komponentu.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.rootInteraction) {
      this.refreshRootInteraction();
    }
  }

  // TODO: tu by mala byt implementovana funkcionalita na vytvorenie sceny
  // pri update sa len zmenia veci na scene ale nesmie sa vytvarat nova isra a pod.
  // TODO: konstanty vytiahnut von
  ngAfterViewInit() {
    // Calculate canvas size
    let width = window.innerWidth * 0.85;
    let height = window.innerHeight;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#fff');

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // Create renderer
    this.renderer = new CSS3D.Renderer();
    this.renderer.setSize(width, height);
    this.sceneDiv.nativeElement.appendChild(this.renderer.domElement);

    // Adjust camera position
    this.camera.position.z = 800;

    // Controls
    this.controls = new SequenceDiagramOrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 0.5;

    // TODO: target by mal byt 200px za aktualnym platnom
    // this.controls.target = new THREE.Vector3(layer.position.x, layer.position.y, layer.position.z -200);
    // docasna implementacia pre pracu s exampleom
    this.controls.target = new THREE.Vector3(0, 0, -200);

    // Render scene
    this.render();
  }

  protected processExecutions(lifeline: M.Lifeline) {

    // TODO: konštanta - vertikálna medzera pred začiatkom a za koncom execution bloku
    let verticalPadding = 10;

    let executions = [];

    for (let occurrenceSpecification of lifeline.occurrenceSpecifications) {
      for (let execution of occurrenceSpecification.startingExecutionSpecifications) {
        let duration = execution.finish.time - execution.start.time;
        executions.push({
          top: execution.start.time - verticalPadding,
          height: duration + (2 * verticalPadding)
        });
      }
    }

    return executions;
  }

  protected processLifelines(interaction: M.Interaction) {

    // Inicializácia výstupného poľa
    let lifelines = [];

    // Poradové číslo lifeliny z ľavej strany
    let orderNumber = 0;

    // TODO: 1200 = layer.width
    // TODO: 120  = lifeline.width

    let lifelineModels = interaction.lifelines;

    // Medzery medzi lifelinami sa prispôsobujú podľa ich počtu
    let gap = Math.floor((1200 - 120) / (lifelineModels.length - 1)) || 0;

    for (let lifeline of lifelineModels) {
      lifeline.leftDistance = orderNumber++ * gap;

      let lifelineJSON = {
        left: lifeline.leftDistance,
        title: lifeline.name,
        executions: this.processExecutions(lifeline)
      };

      lifelines.push(lifelineJSON);
    }

    return lifelines;
  }

  protected resolveMessageDirection(message: M.Message) {

    // Message smeruje z lifelineA do lifelineB
    let lifelineALeft = message.sendEvent.covered.leftDistance;
    let lifelineBLeft = message.receiveEvent.covered.leftDistance;

    return (lifelineBLeft - lifelineALeft >= 0) ? 'left-to-right' : 'right-to-left';
  }

  protected resolveMessageType(message: M.Message) {
    switch (message.sort) {
      case 'synchCall': return 'sync';
      case 'asynchCall': return 'async';
    }
  }

  protected resolveMessageLength(message: M.Message) {
    let lifelineALeft = message.sendEvent.covered.leftDistance;
    let lifelineBLeft = message.receiveEvent.covered.leftDistance;

    // 12 = 2*6; 6 = execution.width/2
    return Math.abs(lifelineALeft - lifelineBLeft) - 12;
  }

  protected resolveMessagePosition(message: M.Message) {
    let lifelineALeft = message.sendEvent.covered.leftDistance;
    let lifelineBLeft = message.receiveEvent.covered.leftDistance;

    let left = Math.min(lifelineALeft, lifelineBLeft);

    // TODO 60 je polovica zo 120, 120 je šírka lifeliny
    // 6 = execution.width/2

    // 50 = lifeline-title-height
    // 15 = message.height/2
    return {
      left: left + 60 + 6,
      top: message.sendEvent.time + 50 - 15
    };
  }

  protected processMessages(interaction: M.Interaction) {
    let messages = [];

    for (let messageModel of interaction.recursiveMessages) {
      let messagePosition = this.resolveMessagePosition(messageModel);

      let message = {
        direction: this.resolveMessageDirection(messageModel),
        type: this.resolveMessageType(messageModel),
        title: messageModel.name,
        length: this.resolveMessageLength(messageModel),
        top: messagePosition.top,
        left: messagePosition.left
      };

      messages.push(message);
    }

    return messages;
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
    // 50  = lifeline.title.height
    // 120 = lifeline.title.width
    let envelope = {
      minimalTime: minimalTime + 50,
      maximalTime: maximalTime + 50,
      mostLeft: mostLeft,
      mostRight: mostRight + 120
    };

    // TODO: toto je asi nepotrebné
    // Prejdeme všetky podfragmenty
    /*for (let childFragment of interactionFragment.children) {
      let childEnvelope = this.envelopeFragment(childFragment);

      if (childEnvelope.minimalTime < envelope.minimalTime) envelope.minimalTime = childEnvelope.minimalTime;
      if (childEnvelope.maximalTime > envelope.maximalTime) envelope.maximalTime = childEnvelope.maximalTime;
      if (childEnvelope.mostLeft < envelope.mostLeft) envelope.mostLeft = childEnvelope.mostLeft;
      if (childEnvelope.mostRight > envelope.mostRight) envelope.mostRight = childEnvelope.mostRight;
    }*/

    let fragmentPadding = 20;

    // TODO: tu to treba implementovat "inteligentne" aby vedel v akom poradi
    // idu interakcie a podfragmenty a nasledne urci ci ma davat padding zhora/zdola/oboje
    // Pozn. zlava a zprava bdue padding vzdy
    if (interactionFragment.getRecursiveFragments('CombinedFragment').length > 0) {

      // TODO: tieto dve tu nebudu vzdy, len niekedy
      envelope.minimalTime -= fragmentPadding;
      // envelope.maximalTime += fragmentPadding;

      // TODO: toto tu bdue vzdy
      envelope.mostLeft -= fragmentPadding;
      envelope.mostRight += fragmentPadding;
    }

    return envelope;
  }

  protected processOperands(combinedFragment: M.CombinedFragment) {

    // TODO: konštanty - vertikálna medzera pred začiatkom a za koncom execution bloku
    const topPadding = 40;
    const bottomPadding = 40;

    // Vytrovíme výsledné pole operandov
    let operands = [];

    // Prejdeme všetkých potomkov
    for (let childFragment of combinedFragment.fragment.children) {

      // Je potomok typu InteractionOperand ?
      if (childFragment.fragmentable.constructor.name === 'InteractionOperand') {
        let interactionOperand = childFragment.fragmentable;
        let envelope = this.envelopeFragment(childFragment);

        operands.push({
          height: envelope.maximalTime - envelope.minimalTime + topPadding + bottomPadding,
          constraint: interactionOperand.constraint
        });
      }
    }

    // TODO: Toto asi nepotrebujeme
    // Pridáme vnútorný okraj prvému operandu
    /*if (operands[0]) {
      operands[0].height += topPadding;
    }

    // Pridáme vnútorný okraj poslednému operandu
    let lastIndex = (operands.length - 1);
    if (operands[lastIndex]) {
      operands[lastIndex].height += bottomPadding;
    }*/

    return operands;
  }

  protected processFragments(interaction: M.Interaction) {

    // TODO: konštanty - vertikálna medzera pred začiatkom a za koncom execution bloku
    let verticalPadding = 40;   //  |
    // let horizontalPadding = 20; // ---

    // Vytrovíme výsledné pole fragmentov
    let fragments = [];

    // Prejdeme všetkých potomkov
    for (let childFragment of interaction.fragment.getRecursiveFragments('CombinedFragment')) {

      let combinedFragment = childFragment.fragmentable;
      let envelope = this.envelopeFragment(childFragment);

      // 60 = lifeline.title.width / 2
      // 30 = 60 / 2
      fragments.push({
        title: combinedFragment.operator,
        width: envelope.mostRight - envelope.mostLeft - 60,
        top: envelope.minimalTime - verticalPadding,
        left: envelope.mostLeft + 30,
        operands: this.processOperands(combinedFragment)
      });
    }

    return fragments;
  }

  /* TODO:
   * tato metoda sa zovola vzdy ked sa zmeni rootInteraction
   * treba ju implementovat tak, aby vzdy prekreslila scenu
   */
  protected refreshRootInteraction() {

    // TODO: len pomocne
    console.log('The root interaction is ', this.rootInteraction);

    // Vykreslíme tri layery
    /*let lifelines = this.processLifelines(this.rootInteraction);
    let messages = this.processMessages(this.rootInteraction);
    let fragments = this.processFragments(this.rootInteraction);

    this.layers = [
      {
        lifelines: lifelines,
        messages: messages,
        fragments: fragments
      },
      {
        lifelines: lifelines,
        messages: messages,
        fragments: fragments
      },
      {
        lifelines: lifelines,
        messages: messages,
        fragments: fragments
      }
    ];*/

    // TODO: toto je len pomocné
    let limit = 3;
    this.layers = [];

    // Render root interaction
    // for (let i = 0; i < 3; i++)
    this.layers.push({
      lifelines: this.processLifelines(this.rootInteraction),
      messages: this.processMessages(this.rootInteraction),
      fragments: this.processFragments(this.rootInteraction)
    });

    // TODO: pomocné
    // Render all interactions
    for (let interactionFragment of this.rootInteraction.fragment.getRecursiveFragments('Interaction')) {
      let interaction = interactionFragment.fragmentable;
      if (interaction !== this.rootInteraction) {
        if (--limit < 0) {
          break;
        }
        this.layers.push({
          lifelines: this.processLifelines(interaction),
          messages: this.processMessages(interaction),
          fragments: this.processFragments(interaction)
        });
      }
    }

    /*let secondInteraction = this.service.getRecord(M.Interaction, '2');
    let thirdInteraction = this.service.getRecord(M.Interaction, '6');

    this.layers = [
      {
        lifelines: this.processLifelines(this.rootInteraction),
        messages: this.processMessages(this.rootInteraction),
        fragments: this.processFragments(this.rootInteraction)
      },
      {
        lifelines: this.processLifelines(secondInteraction),
        messages: this.processMessages(secondInteraction),
        fragments: this.processFragments(secondInteraction)
      },
      {
        lifelines: this.processLifelines(thirdInteraction),
        messages: this.processMessages(thirdInteraction),
        fragments: this.processFragments(thirdInteraction)
      }
    ];*/

    // Upravili sme pole "this.layers", diagram treba znova vyrenderovať
    this.diagramChanged = true;
  }

  // Render loop
  render() {
    const self = this;

    requestAnimationFrame(function () {
      self.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

}
