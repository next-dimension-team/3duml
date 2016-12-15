import * as THREE from 'three';
import { Component, ViewChild, SimpleChanges, Input, ViewChildren, QueryList, AfterViewInit, OnChanges, AfterViewChecked } from '@angular/core';
import { SequenceDiagramService } from '../services';
import { LayerComponent } from './layer.component';
import { SequenceDiagramOrbitControls } from './sequence.diagram.orbit.controls';
import * as M from '../models';

var CSS3D = require('three.css')(THREE);

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
  selector: 'sequence-diagram',
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

  ///////////////////////////////////////////
  // TODO: tieto polia tu asi nebudu
  /*public lifelines = [
    {
      left: 0,
      title: "dáminik",
      executions: [
        {
          top: 50,
          height: 100,
        }
      ]
    },
    {
      left: 150,
      title: "zajo",
      executions: [
        {
          top: 0,
          height: 50,
        },
      ]
    }
  ];

  public messages = [
    {
      direction: "left-to-right",
      type: "async",
      title: "ahoj()",
      length: 500,
      top: 280,
      left: 500 + 60
    }
  ];

  public fragments = [
    {
      title: "alt",
      width: 320,
      top: 90,
      left: 20,
      // TODO: operands
    }
  ];*/

  public layers = [
    /*{
      lifelines: this.lifelines,
      messages: this.messages,
      fragments: this.fragments
    },
    {
      lifelines: this.lifelines,
      messages: this.messages,
      fragments: this.fragments
    },
    {
      lifelines: this.lifelines,
      messages: this.messages,
      fragments: this.fragments
    }*/
  ];
  ///////////////////////////////////////////

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
      var element: HTMLElement = layerComponent.element.nativeElement;
      var layer: Layer = new Layer(element, layerNum++);
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
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

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

  // TODO
  protected processExecutions(lifeline: M.Lifeline) {
    return [
      {
        top: 50,
        height: 100,
      }
    ];
  }

  protected processLifelines(interaction: M.Interaction) {

    // Inicializácia výstupného poľa
    let lifelines = [];ng

    // Poradové číslo lifeliny z ľavej strany
    let orderNumber = 0;

    for (let lifeline of interaction.lifelines) {
      lifelines.push({
        left: orderNumber++ * 500,
        title: lifeline.name,
        executions: this.processExecutions(lifeline)
      });
    }

    return lifelines;
  }

  protected processMessages(interaction: M.Interaction) {
    return [];
  }

  protected processFragments(interaction: M.Interaction) {
    return [];
  }

  /* TODO:
   * tato metoda sa zovola vzdy ked sa zmeni rootInteraction
   * treba ju implementovat tak, aby vzdy prekreslila scenu
   */
  protected refreshRootInteraction() {

    // TODO: len pomocne
    console.info("The root interaction is ", this.rootInteraction);

    // Vykreslíme tri layery
    let lifelines = this.processLifelines(this.rootInteraction);
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
    ];

    this.diagramChanged = true;
  }

  // Render loop
  render() {
    var self = this;
    requestAnimationFrame(function () {
      self.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

}
