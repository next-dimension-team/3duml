import { Controller } from './Controller';
import { Renderable } from './Renderable';
import { Destroyable } from './Destroyable';

export abstract class View implements Renderable, Destroyable {
  public abstract render(): void;

  public destroy(): void {
    throw new Error("Destroy method not implemented");
  }

  constructor(protected _controller: Controller) { }

  public getController(): Controller {
    return this._controller;
  }

  public setController(controller: Controller): void {
    this._controller = controller;
  }
}