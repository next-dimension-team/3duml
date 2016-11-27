import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {

  @Output() public addLayer = new EventEmitter;

  addLayerEvent(): void {
    this.addLayer.emit();
  }

}
