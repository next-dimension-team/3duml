import * as go from 'gojs';
import * as THREE from 'three';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SequenceDiagramTemplate } from './sequence-diagram/templates/SequenceDiagramTemplate';
import { LifelineTemplate } from './sequence-diagram/templates/LifelineTemplate';
import { MessageLinkTemplate } from './sequence-diagram/templates/MessageLinkTemplate';
import { Datastore } from './Datastore';

/*
 * Class representing 3D layer
 */
export class Layer extends THREE.CSS3DObject {
  constructor(depth: number) {
    // Create HTML div element
    var element = document.createElement('div');
    
    // Add layer class
    element.className = 'layer';

    // Create CSS3DObject object
    super(element);

    // Adjust layer position
    this.position.z = -250 * depth;
  }
}

@Component({
  selector: 'app-sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  styleUrls: ['./sequence.diagram.component.css']
})
export class SequenceDiagramComponent implements AfterViewInit {

  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.CSS3DRenderer;
  public controls: THREE.TrackballControls;
  public layerNum: number = 0;

  @ViewChild('diagram') diagramDiv;

  constructor(private datastore: Datastore) { }

  ngAfterViewInit() {
    this.showScene();
  }

  showScene() {
    // Calculate canvas size
    let width = window.innerWidth * 0.8;
    let height = window.innerHeight;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#fff");

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // Create renderer
    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.setSize(width, height);
    this.diagramDiv.nativeElement.appendChild(this.renderer.domElement);

    // Create layers
    /*this.layerA = new Layer(1);
    this.scene.add(this.layerA);

    this.layerB = new Layer(2);
    this.scene.add(this.layerB);*/

    // Create 2D sequence diagrams on layers
    /*this.createGoJSDiagram(this.layerA);
    this.createGoJSDiagram(this.layerB);*/

    // Adjust camera position
    this.camera.position.z = 800;

    // Controls
    var orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    /*this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 0.5;
    this.controls.minDistance = 500;
    this.controls.maxDistance = 6000;
    this.controls.addEventListener('change', this.render);*/

    // Render scene
    this.render();
  }

  // Render loop
  render() {
    var self = this;
    requestAnimationFrame(function() {
      self.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  createGoJSDiagram(layer: Layer) {
    let myDiagram: go.Diagram;

    let sequenceDiagram: SequenceDiagramTemplate = new SequenceDiagramTemplate(layer.element);
    let lifeLine: LifelineTemplate = new LifelineTemplate();
    let messagelink: MessageLinkTemplate = new MessageLinkTemplate();

    myDiagram = sequenceDiagram.getTemplate();
    myDiagram.groupTemplate = lifeLine.getTemplate();
    myDiagram.linkTemplate = messagelink.getTemplate();

    myDiagram.addDiagramListener('Modified', function (e) {
      // let button: HTMLInputElement = document.getElementById('SaveButton');
      // if (button) button.disabled = !this.sequenceDiagram.isModified;
      let idx = window.document.title.indexOf('*');
      if (myDiagram.isModified) {
        if (idx < 0) {
          window.document.title += '*';
        }
      } else {
        if (idx >= 0) {
          window.document.title = window.document.title.substr(0, idx);
        }
      }
    });

    // create
    let nodeDataArray = [
      { 'key': 'Fred', 'text': 'Fred: Patron', 'isGroup': true, 'loc': '0 0', 'duration': 9 },
      { 'key': 'Bob', 'text': 'Bob: Waiter', 'isGroup': true, 'loc': '100 0', 'duration': 9 },
      { 'key': 'Hank', 'text': 'Hank: Cook', 'isGroup': true, 'loc': '200 0', 'duration': 9 },
      { 'key': 'Renee', 'text': 'Renee: Cashier', 'isGroup': true, 'loc': '500 0', 'duration': 9 }
    ];

    let linkDataArray = [
      { 'from': 'Fred', 'to': 'Bob', 'text': 'order', 'time': 1 },
      { 'from': 'Bob', 'to': 'Hank', 'text': 'order food', 'time': 2 },
      { 'from': 'Bob', 'to': 'Fred', 'text': 'serve drinks', 'time': 3 },
      { 'from': 'Hank', 'to': 'Bob', 'text': 'finish cooking', 'time': 5 },
      { 'from': 'Bob', 'to': 'Fred', 'text': 'serve food', 'time': 6 },
      { 'from': 'Fred', 'to': 'Renee', 'text': 'pay', 'time': 8 }
    ];

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }

  /* Menu callbacks */
  public addLayer() {
    var layer: Layer = new Layer(++this.layerNum);
    this.scene.add(layer);
    this.createGoJSDiagram(layer);
  }
}
