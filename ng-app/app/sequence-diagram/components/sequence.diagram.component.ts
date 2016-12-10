import * as THREE from 'three';
import { Component, ViewChild, AfterViewInit, OnInit, Input, OnChanges, ViewChildren, QueryList } from '@angular/core';
import { Datastore } from '../../datastore';
import { InteractionService } from '../services';
import { Interaction } from '../models';
import { LayerComponent } from './layer.component';
//import * as Models from '../models';

var CSS3D = require('three.css')(THREE);
var OrbitControls = require('three-orbit-controls')(THREE);

// TODO: tuto triedu dat niekam inam alebo ju uplne zrusit
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

/*
 * Class for controling camera of sequence diagram
 */
class SequenceDiagramOrbitControls extends OrbitControls {
  constructor(object, domElement, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, mouseScrollingSpeed, minDistanceToTarget) {
    super(object, domElement);

    this.minPolarAngle = minPolarAngle;
    this.maxPolarAngle = maxPolarAngle;
    this.minAzimuthAngle = minAzimuthAngle;
    this.maxAzimuthAngle = maxAzimuthAngle;
    this.minDistanceToTarget = minDistanceToTarget;
    this.mouseScrollingSpeed = mouseScrollingSpeed;

    this.enableZoom = false;
    this.domElement.addEventListener('wheel', function (e) { this.handleMouseWheel(e); }.bind(this), false);
  }

  handleMouseWheel(event) {
    var distance = this.distance(this.target.z, this.object.position.z);

    if (event.deltaY < 0 && distance > this.minDistanceToTarget) {
      this.object.position.z -= this.mouseScrollingSpeed;

    } else if (event.deltaY > 0) {
      this.object.position.z += this.mouseScrollingSpeed;
    }
    this.update();
  }

  distance(a, b) {

    if ((a >= 0 && b >= 0) || (a <= 0 && b <= 0)) {
      return Math.abs(a - b);
    }

    if (a > 0 && b < 0) {
      return a + Math.abs(b);
    }

    if (a < 0 && b > 0) {
      return Math.abs(a) + b;
    }
  }
}

@Component({
  selector: 'sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  providers: [InteractionService]
})
export class SequenceDiagramComponent implements AfterViewInit, OnInit, OnChanges {

  @ViewChild('scene') sceneDiv;

  // http://stackoverflow.com/questions/40819739/angular-2-template-reference-variable-with-ngfor
  // http://stackoverflow.com/questions/32693061/angular-2-typescript-get-hold-of-an-element-in-the-template/35209681#35209681
  @ViewChildren('layerComponents') layerComponents: QueryList<LayerComponent>;

  protected scene: THREE.Scene;
  protected camera: THREE.Camera;
  protected controls: OrbitControls;
  protected renderer: CSS3D.Renderer;
  protected layerNum: number = 0;

  @Input()
  public rootInteraction: Interaction;

  ///////////////////////////////////////////
  // TODO: tieto polia tu asi nebudu
  public lifelines = [
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
      length: 150,
      top: 120,
      left: 50
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
  ];

  public layers = [
    {
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
    }
  ];
  ///////////////////////////////////////////

  constructor(private interactionService: InteractionService, private datastore: Datastore) {
    /*
    // Find interaction
    this.datastore.findRecord(Models.Interaction, '1').subscribe(
      (interaction: Models.Interaction) => {
        //console.log(interaction);

        var firstMessage = interaction.messages[0];

        console.log("here it isnt", firstMessage.receiveEvent);

        // Find message
        this.datastore.findRecord(Models.Message, interaction.messages[0].id).subscribe(
          (message: Models.Message) => {
            //console.log(message);
            console.log("here it should be", message.receiveEvent);

            // Find occurence specifications
            this.datastore.findRecord(Models.OccurrenceSpecification, message.receiveEvent.id).subscribe(
              (occurrenceSpecification: Models.OccurrenceSpecification) => {
                //console.log(occurrenceSpecification);
              }
            );
          }
        );

        firstMessage.withRelationships().then(r => {
          console.log("here we wanna it", r.receiveEvent);
        });
      }
    );
    */
  }

  // TODO: toto bduem mozno portrebovat, ak nie dat to prec,
  // tato metoda sluzi na nacitavanie dat z datastore (nemalo by to byt v konstruktore)
  ngOnInit() {
    //
  }

  ngOnChanges() {
    if (this.rootInteraction) {
      this.refreshRootInteraction()
    }
  }

  // TODO: tu by mala byt implementovana funkcionalita na vytvorenie sceny
  // pri update sa len zmenia veci na scene ale nesmie sa vytvarat nova isntancia kamery, renderera a pod.
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
    var minPolarAngle = 0.25 * Math.PI; // radians
    var maxPolarAngle = 0.75 * Math.PI; // radians
    var minAzimuthAngle = - 0.35 * Math.PI; // radians
    var maxAzimuthAngle = 0.35 * Math.PI; // radians
    var minDistanceToTarget = 500;
    var mouseScrollingSpeed = 50;

    this.controls = new SequenceDiagramOrbitControls(this.camera, this.renderer.domElement, minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle, mouseScrollingSpeed, minDistanceToTarget);

    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.5;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.0;

    // Render scene
    this.render();
  }

  /* TODO:
   * tato metoda sa zovola vzdy ked sa zmeni rootInteraction
   * treba ju implementovat tak, aby vzdy prekreslila scenu
   */
  private refreshRootInteraction() {
    // TODO: len pomocne
    console.log("Load sequence diagram. The root interaction is ", this.rootInteraction);

    // Create layers
    for (let layerComponent of this.layerComponents.toArray()) {
      var element: HTMLElement = layerComponent.element.nativeElement;
      var layer: Layer = new Layer(element, this.layerNum++);
      // target by mal byt 200px za aktualnym platnom
      // this.controls.target = new THREE.Vector3(layer.position.x, layer.position.y, layer.position.z -200);
      this.controls.target = new THREE.Vector3(0, 0, -200);
      this.scene.add(layer);

    }
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
