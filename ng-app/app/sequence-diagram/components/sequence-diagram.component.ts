import * as THREE from 'three';
import {
  Component, SimpleChanges, Input, ViewChildren, HostListener,
  QueryList, AfterViewInit, OnInit, OnChanges, NgZone, ElementRef
} from '@angular/core';
import { LayerComponent } from './layer.component';
import { SequenceDiagramControls } from './sequence-diagram.controls';
import { SelectableService } from '../services';
import * as M from '../models';
let { Renderer: CSS3DRenderer } : { Renderer: typeof THREE.CSS3DRenderer } = require('three.css')(THREE);

@Component({
  selector: 'app-sequence-diagram',
  templateUrl: './sequence-diagram.component.html'
})
export class SequenceDiagramComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChildren('layerComponents')
  protected layerComponents: QueryList<LayerComponent>;

  @Input()
  public rootInteractionFragment: M.InteractionFragment;

  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected controls: SequenceDiagramControls;
  protected renderer: THREE.CSS3DRenderer;

  protected renderQueued = false;

  constructor(protected ngZone: NgZone, protected element: ElementRef, protected selectableService: SelectableService) {
    // TODO: Toto je ukážkový kód, ako počúvať na označenie elementu.

    this.selectableService.onLeftClick((event) => {
      console.log("--------------------------------");
      console.info("Event typu: LeftClick");
      console.log("Klikol si na " + event.model.type + " s ID " + event.model.id);
      console.log("Súradnice tvojho kliknutia zľava: " + event.offsetX);
      console.log("Súradnice tvojho kliknutia zhora: " + event.offsetY);
      console.log("Detaily eventu: ");
      console.log(event);
      console.log("--------------------------------");
    });
  }

  public ngOnInit() {
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
    this.element.nativeElement.appendChild(this.renderer.domElement);

    // Adjust camera position
    this.camera.position.z = 800;

    // Controls
    this.controls = new SequenceDiagramControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => this.queueRender());
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (! changes.rootInteractionFragment.isFirstChange()) {
      this.controls.reset();
    }
  }

  public ngAfterViewInit() {
    this.layerComponents.changes.subscribe(
      () => {
        this.refreshLayers();
        this.queueRender();
      }
    );

    // emit first update
    this.layerComponents.notifyOnChanges();
  }

  @HostListener('window:resize')
  public onWindowResize() {
    let width = window.innerWidth * 0.85;
    let height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.queueRender();
  }

  public queueRender() {
    if (! this.renderQueued) {
      this.renderQueued = true;

      this.ngZone.runOutsideAngular(
        () => requestAnimationFrame(() => this.render())
      );
    }
  }

  protected refreshLayers() {
    this.layerComponents.forEach(
      (layer, index) => {
        this.scene.add(layer.object.translateZ(-600 * index));
      }
    );

    this.controls.target = this.layerComponents.last.object.position.clone();
  }

  protected render() {
    this.renderQueued = false;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

}
