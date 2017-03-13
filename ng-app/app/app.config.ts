import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
  layer: {
    gap: number
  },
  camera: {
    fov: number,
    near: number,
    far: number,
    z: number
  }
}

export const AppConfig: IAppConfig = {
  layer: {
    gap: 600
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    z: 800
  }
};
