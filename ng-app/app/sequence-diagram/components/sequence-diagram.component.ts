import { ConfigService } from '../../config';
import { LayersController, LifelinesController, SequenceDiagramController } from '../controllers';
import { MessagesController } from '../controllers/messages.controller';
import * as M from '../models';
import { SequenceDiagramService } from '../services';
import { JobsService } from '../services/jobs.service';
import { LayerComponent } from './layer.component';
import { SequenceDiagramControls } from './sequence-diagram.controls';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import * as THREE from 'three';
let { Renderer: CSS3DRenderer }: { Renderer: typeof THREE.CSS3DRenderer } = require('three.css')(THREE);

@Component({
  selector: 'app-sequence-diagram',
  templateUrl: './sequence-diagram.component.html'
})
export class SequenceDiagramComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChildren('layerComponents')
  protected layerComponents: QueryList<LayerComponent>;

  @Input()
  public rootInteractionFragment: M.InteractionFragment;

  @Input()
  public editMode: boolean;
  protected editingLayerIndex: number = 0;

  protected scene: THREE.Scene;
  protected camera: THREE.PerspectiveCamera;
  protected controls: SequenceDiagramControls;
  protected renderer: THREE.CSS3DRenderer;

  protected renderQueued = false;

  constructor(
    protected ngZone: NgZone,
    protected element: ElementRef,
    protected config: ConfigService,
    protected jobsService: JobsService,
    protected sequenceDiagramService: SequenceDiagramService,
    protected sequenceDiagramController: SequenceDiagramController,
    protected layersController: LayersController,
    protected lifelinesController: LifelinesController,
    protected messagesController: MessagesController
  ) {
    // Set self to services and controllers
    this.sequenceDiagramService.sequenceDiagramComponent = this;
    this.sequenceDiagramController.sequenceDiagramComponent = this;
    this.layersController.sequenceDiagramComponent = this;
    this.lifelinesController.sequenceDiagramComponent = this;
    this.messagesController.menuComponent = this;
  }

  public ngOnInit() {
    // Calculate canvas size
    let width = window.innerWidth * 0.80;
    let height = window.innerHeight;

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#fff');

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      this.config.get('camera.fov'),
      width / height,
      this.config.get('camera.near'),
      this.config.get('camera.far')
    );

    // Create renderer
    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(width, height);
    this.element.nativeElement.appendChild(this.renderer.domElement);

    // Adjust camera position
    this.camera.position.z = this.config.get('camera.z');

    // Controls
    this.controls = new SequenceDiagramControls(
      this.camera,
      this.renderer.domElement,
      this.config.get('controls')
    );

    this.controls.addEventListener('change', () => this.queueRender());
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.rootInteractionFragment && !changes.rootInteractionFragment.isFirstChange()) {
      this.controls.reset();
    }

    if (changes.editMode) {
      if (this.controls) {
        this.controls.enabled = !this.editMode;
      }
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
    let width = window.innerWidth * 0.80;
    let height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.queueRender();
  }

  // Change edit layer
  @HostListener('window:mousewheel', ['$event'])
  public onMouseScroll($event) {
    if ($event.deltaY > 0) {
      this.editingLayerIndex--;
    } else {
      this.editingLayerIndex++;
    }

    this.refreshEditingLayer();
  }

  public get editingLayer(): M.InteractionFragment {
    return this.rootInteractionFragment.children[this.editingLayerIndex];
  }

  public set editingLayer(layer: M.InteractionFragment) {
    this.editingLayerIndex = this.rootInteractionFragment.children.indexOf(layer);

    this.refreshEditingLayer();
  }

  protected refreshEditingLayer() {
    let maxIndex = this.rootInteractionFragment.children.length - 1;

    if (this.editingLayerIndex < 0) {
      this.editingLayerIndex = 0;
    }

    if (this.editingLayerIndex > maxIndex) {
      this.editingLayerIndex = maxIndex;
    }
  }

  public queueRender() {
    if (!this.renderQueued) {
      this.renderQueued = true;

      this.ngZone.runOutsideAngular(
        () => requestAnimationFrame(() => this.render())
      );
    }
  }

  protected refreshLayers() {
    this.layerComponents.forEach(
      (layer, index) => this.scene.add(
        layer.object.translateZ(this.config.get('layer.gap') * -index)
      )
    );

    this.controls.target = this.layerComponents.length > 0
      ? this.layerComponents.last.object.position.clone()
      : new THREE.Vector3();
  }

  protected render() {
    this.renderQueued = false;

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  /*
   * Refresh Diagram
   * 
   * Znova načíta strom modelov z databázy, čím refreshne celý diagram.
   * 
   */
  public refresh(callback?: any): void {
    this.jobsService.start('sequence.diagram.component.refresh');
    this.sequenceDiagramService.loadSequenceDiagramTree(this.rootInteractionFragment.fragmentable)
      .subscribe((interactionFragment: M.InteractionFragment) => {
        this.rootInteractionFragment = interactionFragment;
        this.refreshEditingLayer();
        if (callback) callback();
        this.jobsService.finish('sequence.diagram.component.refresh');
      });
  }

}
