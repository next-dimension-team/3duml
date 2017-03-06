import * as THREE from 'three';
import {
  Component, ViewChild, SimpleChanges, Input, ViewChildren,
  QueryList, AfterViewInit, OnChanges, AfterViewChecked, NgZone
} from '@angular/core';
import { SequenceDiagramService, SelectableService } from '../services';
import { LayerComponent } from './layer.component';
import { SequenceDiagramControls } from './sequence-diagram.controls';
import * as M from '../models';
import * as _ from 'lodash';

let { Object: CSS3DObject, Renderer: CSS3DRenderer } : {
  Object: typeof THREE.CSS3DObject,
  Renderer: typeof THREE.CSS3DRenderer
} = require('three.css')(THREE);

/*
 * Class representing 3D layer
 */
export class Layer extends CSS3DObject {
  constructor(element: HTMLElement, depth: number) {
    // Create CSS3DObject object
    super(element);

    // Adjust layer position
    this.position.z = -600 * depth;
  }
}

@Component({
  selector: 'new-app-sequence-diagram',
  templateUrl: './sequence-diagram.component.html',
  providers: [SequenceDiagramService]
})
export class NewSequenceDiagramComponent implements AfterViewInit, OnChanges, AfterViewChecked {

  @ViewChild('scene') sceneDiv;

  // http://stackoverflow.com/questions/40819739/angular-2-template-reference-variable-with-ngfor
  @ViewChildren('layerComponents') layerComponents: QueryList<LayerComponent>;

  protected scene: THREE.Scene;
  protected camera: THREE.Camera;
  protected controls: SequenceDiagramControls;
  protected renderer: THREE.CSS3DRenderer;

  @Input()
  public rootInteraction: M.Interaction;

  protected layers = [];

  protected layerElements = [];

  constructor(private _ngZone: NgZone, protected service: SequenceDiagramService, protected selectableService: SelectableService) {

  }

  protected refreshDiagram() {

    this.layers = _.uniq(_.map(this.rootInteraction.recursiveLifelines, 'layer'));

    console.log(this.layers);

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
      this.refreshDiagram();
    }
  }

  // TODO: toto upravit cez subscribe
  ngAfterViewChecked() {
    if (this.rootInteraction) {
      this.refreshDiagram();
    }
  }

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
    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(width, height);
    this.sceneDiv.nativeElement.appendChild(this.renderer.domElement);

    // Adjust camera position
    this.camera.position.z = 800;

    // Controls
    this.controls = new SequenceDiagramControls(this.camera, this.renderer.domElement);

    // TODO: target by mal byt 200px za aktualnym platnom
    // this.controls.target = new THREE.Vector3(
    //     layer.position.x, layer.position.y, layer.position.z -200
    // );
    // docasna implementacia pre pracu s exampleom
    this.controls.target = new THREE.Vector3(0, 0, -200);

    // Render scene
    this._ngZone.runOutsideAngular(() => this.render());
  }

  protected render() {
    requestAnimationFrame(() => this.render());

    this.renderer.render(this.scene, this.camera);
  }

}
