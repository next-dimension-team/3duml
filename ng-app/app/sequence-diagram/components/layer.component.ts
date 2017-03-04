import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent {

  @Input()
  public id: string;

  @Input()
  public depth;

  @Input()
  public lifelines;

  @Input()
  public messages;

  @Input()
  public fragments;

  constructor(public element: ElementRef) { }

}
