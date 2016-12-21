// For vendors for example jQuery, Lodash, angular2-jwt just import them here unless you plan on
// chunking vendors files for async loading. You would need to import the async loaded vendors
// at the entry point of the async loaded file. Also see custom-typings.d.ts as you also need to
// run `typings install x` where `x` is your module

// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/forms';
import '@angular/http';
// import '@angular/router';

// AngularClass
import '@angularclass/hmr';

// RxJS
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import * as THREE from 'three';
const CSS3D = require('three.css')(THREE);
(THREE as any).OrbitControls = require('three-orbit-controls')(THREE);
(THREE as any).CSS3DObject = CSS3D.Object;
(THREE as any).CSS3DSprite = CSS3D.Sprite;
(THREE as any).CSS3DRenderer = CSS3D.Renderer;

import 'angular2-jsonapi';

import 'reflect-metadata';

if ('production' === ENV) {
  // Production
} else {
  // Development
}
