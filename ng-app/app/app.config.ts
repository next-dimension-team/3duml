import { OpaqueToken } from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface IAppConfig {
  layer: {
    gap: number,
    padding: number
  };
  lifeline: {
    width: number,
    gap: number
  };
  camera: {
    fov: number,
    near: number,
    far: number,
    z: number
  };
  controls: {
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
  };
}

export const AppConfig: IAppConfig = {
  layer: {
    gap: 1000,
    padding: 30
  },
  lifeline: {
    width: 120,
    gap: 400
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    z: 800
  },
  controls: {
    minPolarAngle: 0.25 * Math.PI,
    maxPolarAngle: 0.75 * Math.PI,
    minAzimuthAngle: - 0.35 * Math.PI,
    maxAzimuthAngle: 0.35 * Math.PI
  }
};
