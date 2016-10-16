import { Observer } from './Observer';

export class Observable {
  protected _observers: Observer[] = [];

  public registerObserver(observer: Observer): void {
    this._observers.push(observer);
  }

  public unregisterObserver(observer: Observer): void {
    for (let i = 0; i < this._observers.length; i++) {
      if (this._observers[i] === observer) {
        this._observers.splice(i, 1);
      }
    }
  }

  public notifyObservers(): void {
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i].update(this);
    }
  }
}