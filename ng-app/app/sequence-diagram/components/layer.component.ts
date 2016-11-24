import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'layer',
  templateUrl: './layer.component.html'
})
export class LayerComponent implements AfterViewInit {

  @Input()
  public depth;

  @Input()
  public lifelines;

  @Input()
  public messages;

  @Input()
  public fragments;

  ngAfterViewInit() {
    //
  }

}