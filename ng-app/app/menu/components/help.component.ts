import { DialogService } from '../../dialog/services';
import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {

  constructor(protected dialogService: DialogService) { }

  /*
   * Diagram Help
   */
  public showCreateDiagramHelp(): void {
    this.dialogService.createHelpDialog('Create Diagram Help', [
      ['1', 'Click-on VIEW MODE', '.mat-tab-label:first-child'],
      ['2', 'Click-on CREATE DIAGRAM', '[data-help="createDiagram"]'],
      ['3', 'Fill the form and click-on OK']
    ]);
  }

  public showViewDiagramHelp(): void {
    this.dialogService.createHelpDialog('View Diagram Help', [
      ['1', 'Click-on VIEW MODE', '.mat-tab-label:first-child'],
      ['2', 'Go-to LIST OF DIAGRAMS', '[data-help="listOfDiagrams"]'],
      ['3', 'Click-on SELECT icon or Diagram name', '[data-help="selectButton"]']
    ]);
  }

  public showEditDiagramHelp(): void {
    this.dialogService.createHelpDialog('Edit Diagram Help', [
      ['1', 'Select Diagram', '.mat-tab-label:first-child'],
      ['2', 'Go-to EDIT MODE', '.mat-tab-label:last-child'],
      ['Alternative', 'Double-click on layer in VIEW MODE']
    ]);
  }

  public showDeleteDiagramHelp(): void {
    this.dialogService.createHelpDialog('Delete Diagram Help', [
      ['1', 'Click-on VIEW MODE', '.mat-tab-label:first-child'],
      ['2', 'Go-to LIST OF DIAGRAMS', '[data-help="listOfDiagrams"]'],
      ['3', 'Click-on DELETE icon in Diagram sub-menu', '[data-help="deleteButton"]']
    ]);
  }

  /*
   * Layer Help
   */
  public showCreateLayerHelp(): void {
    this.dialogService.createHelpDialog('Create Layer Help', [
      ['1', 'Select Diagram', '.mat-tab-label:first-child'],
      ['2', 'Go-to EDIT MODE', '.mat-tab-label:last-child'],
      ['3', 'Click-on CREATE LAYER in CREATE sub-menu', '[data-help="createLayer"]'],
      ['4', 'Fill the form and click-on OK']
    ]);
  }

  public showEditLayerHelp(): void {
    this.dialogService.createHelpDialog('Rename Layer Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE'],
      ['2', 'Double-click on Layer name (top-left corner)', '[data-help="layerTitle"]'],
      ['3', 'Fill the form and click-on OK']
    ]);
  }

  public showDeleteLayerHelp(): void {
    this.dialogService.createHelpDialog('Delete Layer Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on DELETE LAYER icon in DELETE sub-menu', '[data-help="deleteLayer"]'],
      ['3', 'Confirm DELETE operation']
    ]);
  }

  /*
   * Lifeline Help
   */
  public showCreateLifelineHelp(): void {
    this.dialogService.createHelpDialog('Create Lifeline Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on CREATE LIFELINE icon in CREATE sub-menu', '[data-help="createLifeline"]'],
      ['3', 'Fill the form and click-on OK']
    ]);
  }

  public showEditLifelineHelp(): void {
    this.dialogService.createHelpDialog('Edit Lifeline Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on LIFELINE header and hold mouse down', '[data-help="lifelineHeader"]'],
      ['3', 'Move LIFELINE to new destination and release mouse'],
      ['Rename', 'Double-click on LIFELINE header and fill FORM', '[data-help="lifelineHeader"]']
    ]);
  }

  public showDeleteLifelineHelp(): void {
    this.dialogService.createHelpDialog('Delete Lifeline Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on DELETE ELEMENT in DELETE sub menu', '[data-help="deleteElement"]'],
      ['3', 'Click-on LIFELINE header', '[data-help="lifelineHeader"]'],
      ['4', 'Confirm DELETE']
    ]);
  }

  /*
   * Message Help
   */
  public showCreateMessageHelp(): void {
    this.dialogService.createHelpDialog('Create Message Help', [ 
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on POINT on SOURCE LIFELINE', '[data-help="point"]'],
      ['3', 'Click-on POINT on DESTINATION LIFELINE', '[data-help="point"]'],
      ['4', 'Fill the form and click-on OK']
    ]);
  }

  public showEditMessageHelp(): void {
    this.dialogService.createHelpDialog('Edit Message Help', [ 
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['Vertical 1', 'Click-on MESSAGE TITLE and hold mouse down', '[data-help="messageTitle"]'],
      ['Vertical 2', 'Make vertical move with message and release mouse', '[data-help="messageTitle"]'],
      ['Horizontal 1', 'Right-click-on MESSAGE source/destination', '[data-help="point"]'],
      ['Horizontal 2', 'Right-click-on new POINT', '[data-help="point"]'],
      ['Remame', 'Double-click on MESSAGE TITLE and fill FORM', '[data-help="messageTitle"]']
    ]);
  }

  public showDeleteMessagerHelp(): void {
    this.dialogService.createHelpDialog('Delete Message Help', [
      ['1', 'Scroll-on with mouse wheel to Layer in EDIT MODE', '.mat-tab-label:last-child'],
      ['2', 'Click-on DELETE ELEMENT in DELETE sub menu', '[data-help="deleteElement"]'],
      ['3', 'Click-on MESSAGE header', '[data-help="messageTitle"]'],
      ['4', 'Confirm DELETE']
    ]);
  }
}
