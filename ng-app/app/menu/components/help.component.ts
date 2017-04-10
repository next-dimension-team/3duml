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
   /* this.dialogService.createHelpDialog('View Diagram Help',
      '1', 
      'Click-on VIEW MODE', 
      '2', 
      'Go-to LIST OF DIAGRAMS', 
      '3', 
      'Click-on SELECT icon or Diagram name',
    );*/
  }

  public showEditDiagramHelp(): void {
    /*this.dialogService.createHelpDialog('Edit Diagram Help',
      '1', 
      'Select Diagram', 
      '2', 
      'Go-to EDIT MODE',
      'Alternative', 
      'Double-click on layer in VIEW MODE',
    );*/
  }

  public showDeleteDiagramHelp(): void {
    /*this.dialogService.createHelpDialog('Delete Diagram Help', 
      '1', 
      'Click-on VIEW MODE', 
      '2', 
      'Go-to LIST OF DIAGRAMS', 
      '3', 
      'Click-on DELETE icon in Diagram sub-menu',
    );*/
  }

  /*
   * Layer Help
   */
  public showCreateLayerHelp(): void {
    /*this.dialogService.createHelpDialog('Create Layer Help', 
      '1', 
      'Select Diagram', 
      '2', 
      'Go-to EDIT MODE', 
      '3', 
      'Click-on CREATE LAYER in CREATE sub-menu',
      '4', 
      'Fill the form and click-on OK',
    );*/
  }

  public showEditLayerHelp(): void {
    /*this.dialogService.createHelpDialog('Rename Layer Help', 
      '1', 
      'Scroll-on Layer in EDIT MODE', 
      '2', 
      'Double-click on Layer name (top-left corner)', 
      '3', 
      'Fill the form and click-on OK',
    );*/
  }

  public showDeleteLayerHelp(): void {
    /*this.dialogService.createHelpDialog('Delete Layer Help', 
      '1', 
      'Scroll-on Layer in EDIT MODE', 
      '2', 
      'Click-on DELETE LAYER icon in DELETE sub-menu', 
      '3', 
      'Confirm delete operation',
    );*/
  }

  /*
   * Lifeline Help
   */
  public showCreateLifelineHelp(): void {
    //this.dialogService.createHelpDialog('Create Lifeline Help', 'TODO');
  }

  public showEditLifelineHelp(): void {
    //this.dialogService.createHelpDialog('Edit Lifeline Help', 'TODO');
  }

  public showDeleteLifelineHelp(): void {
    //this.dialogService.createHelpDialog('Delete Lifeline Help', 'TODO');
  }

  /*
   * Message Help
   */
  public showCreateMessageHelp(): void {
    //this.dialogService.createHelpDialog('Create Message Help', 'TODO');
  }

  public showEditMessageHelp(): void {
    //this.dialogService.createHelpDialog('Edit Message Help', 'TODO');
  }

  public showDeleteMessagerHelp(): void {
    //this.dialogService.createHelpDialog('Delete Message Help', 'TODO');
  }
}
