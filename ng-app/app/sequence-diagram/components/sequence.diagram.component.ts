//import * as go from 'gojs';
//import * as THREE from 'three';
import { Component, ViewChild, AfterViewInit, OnInit, Input, OnChanges } from '@angular/core';
import { Datastore } from '../../datastore';
import { InteractionService } from '../services';
import { Interaction } from '../models';

/*
 * Class representing 3D layer
 */
/*export class Layer extends THREE.CSS3DObject {
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
}*/

@Component({
  selector: 'sequence-diagram',
  templateUrl: './sequence.diagram.component.html',
  providers: [InteractionService]
})
export class SequenceDiagramComponent implements AfterViewInit, OnInit, OnChanges {

  @Input()
  public rootInteraction: Interaction;

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

  // TODO: multiple layers in 3D
  public layers = [
    {
      lifelines: this.lifelines,
      messages: this.messages,
      fragments: this.fragments
    }
  ];

  constructor(private interactionService: InteractionService) {
    /*// Find interaction
    this.datastore.findRecord(Models.Interaction, '1').subscribe(
      (interaction: Models.Interaction) => {
        console.log(interaction);

        // Find message
        this.datastore.findRecord(Models.Message, interaction.messages[0].id).subscribe(
          (message: Models.Message) => {
            console.log(message);

            // Find occurence specifications
            this.datastore.findRecord(Models.OccurrenceSpecification, message.receiveEvent.id).subscribe(
              (occurrenceSpecification: Models.OccurrenceSpecification) => {
                console.log(occurrenceSpecification);
              }
            );
          }
        );
      }
    );*/
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    //
  }

  ngOnChanges() {
    if (this.rootInteraction) {
      this.refreshRootInteraction()
    }
  }

  private refreshRootInteraction() {
    console.log("Load sequence diagram. The root interaction is ", this.rootInteraction);
  }

  /*
  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.CSS3DRenderer;
  public controls: THREE.TrackballControls;
  public layerNum: number = 0;

  @ViewChild('diagram') diagramDiv;

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

    // Adjust camera position
    this.camera.position.z = 800;

    // Controls
    //var orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);

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

  // Menu callbacks
  public addLayer() {
    var layer: Layer = new Layer(++this.layerNum);
    this.scene.add(layer);
  }
  */
}