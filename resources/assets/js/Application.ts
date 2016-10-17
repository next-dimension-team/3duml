import * as THREE from 'three';

export class Application {
  // Singleton instance
  protected static instance: Application;

  public scene: THREE.Scene;
  public camera: THREE.Camera;
  public renderer: THREE.WebGLRenderer;
  public light: THREE.PointLight;
  
  public frameRequestCallback: FrameRequestCallback = () => {
    requestAnimationFrame(this.frameRequestCallback);

    // Move light with camera
    this.light.position.x = this.camera.position.x;
    this.light.position.y = this.camera.position.y;
    this.light.position.z = this.camera.position.z;

    this.renderer.render(this.scene, this.camera);
  }

  protected constructor() {
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

    // Initialize main light
    this.light = new THREE.PointLight(0xffffff, 1, 1000);
    this.light.position.set(50, 50, 70);
    this.light.shadow.mapSize.width = 4096;
    this.light.shadow.mapSize.height = 4096;
    this.light.castShadow = true;
    this.scene.add(this.light);

    // Render Application
    window.requestAnimationFrame(this.frameRequestCallback);
  }

  public static getInstance(): Application {
    if (this.instance == null) {
      this.instance = new Application;
    }

    return this.instance;
  }
}

// Export global application instance
export var App: Application = Application.getInstance();