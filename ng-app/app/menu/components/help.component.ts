import { DialogService } from '../../dialog/services';
import { LayersController, LifelinesController, SequenceDiagramController } from '../../sequence-diagram/controllers';
import { MessagesController } from '../../sequence-diagram/controllers/messages.controller';
import * as M from '../../sequence-diagram/models';
import { JobsService } from '../../sequence-diagram/services';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { InputService } from '../../sequence-diagram/services/input.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent {

  constructor(protected dialogService: DialogService) {
    //
  }

  /*
   * Diagram Help
   */
  public showCreateDiagramHelp(): void {
    this.dialogService.createHelpDialog("Create Diagram Help", "Priklad nadpisu", "Prikald popisu", "Priklad nadpisu", "Priklad popisu", 
      "Priklad nadpisu", "Priklad Popisu");
  }

  public showViewDiagramHelp(): void {
    this.dialogService.createHelpDialog("View Diagram Help", "TODO");
  }

  public showEditDiagramHelp(): void {
    this.dialogService.createHelpDialog("Edit Diagram Help", "TODO");
  }

  public showDeleteDiagramHelp(): void {
    this.dialogService.createHelpDialog("Delete Diagram Help", "TODO");
  }

  /*
   * Layer Help
   */
  public showCreateLayerHelp(): void {
    this.dialogService.createHelpDialog("Create Layer Help", "TODO");
  }

  public showEditLayerHelp(): void {
    this.dialogService.createHelpDialog("Edit Layer Help", "TODO");
  }

  public showDeleteLayerHelp(): void {
    this.dialogService.createHelpDialog("Delete Layer Help", "TODO");
  }

  /*
   * Lifeline Help
   */
  public showCreateLifelineHelp(): void {
    this.dialogService.createHelpDialog("Create Lifeline Help", "TODO");
  }

  public showEditLifelineHelp(): void {
    this.dialogService.createHelpDialog("Edit Lifeline Help", "TODO");
  }

  public showDeleteLifelineHelp(): void {
    this.dialogService.createHelpDialog("Delete Lifeline Help", "TODO");
  }

  /*
   * Message Help
   */
  public showCreateMessageHelp(): void {
    this.dialogService.createHelpDialog("Create Message Help", "TODO");
  }

  public showEditMessageHelp(): void {
    this.dialogService.createHelpDialog("Edit Message Help", "TODO");
  }

  public showDeleteMessagerHelp(): void {
    this.dialogService.createHelpDialog("Delete Message Help", "TODO");
  }

}
