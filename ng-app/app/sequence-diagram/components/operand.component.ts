import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-operand',
  templateUrl: './operand.component.html'
})
export class OperandComponent {

  @Input()
  public height: number;

  @Input()
  public constraint: string;

}
