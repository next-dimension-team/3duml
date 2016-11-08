import { Component} from '@angular/core';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {
	
  create(): void {
    console.log("Diagram created")
	}
	
}
