import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'fragment',
  templateUrl: './fragment.component.html'
})
export class FragmentComponent implements AfterViewInit {

  @Input()
  public title : string;

  @Input()
  public width : number;

  @Input()
  public top : number;

  @Input()
  public left : number;

  ngAfterViewInit() {
    //
  }

}