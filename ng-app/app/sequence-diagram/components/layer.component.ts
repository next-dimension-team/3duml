import { Component, ViewChild, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent {

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