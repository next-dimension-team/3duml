import * as THREE from 'three';
import { AutoWired, Singleton, Container } from "typescript-ioc";

@Singleton
export class Application {
  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.WebGLRenderer;
  public frameRequestCallback: FrameRequestCallback = () => {
    requestAnimationFrame(this.frameRequestCallback);
    this.renderer.render(this.scene, this.camera);
  }

  constructor() {
    // Initialize scene and camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene.background = new THREE.Color("#75b9e7");

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    // Render Application
    window.requestAnimationFrame(this.frameRequestCallback);
  }
}

// Export global application instance
export var App: Application = Container.get(Application);