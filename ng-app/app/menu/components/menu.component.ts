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
  selector: 'app-sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  // Events
  @Output() public onOpenSequenceDiagram = new EventEmitter;
  @Output() public onCreateLayer = new EventEmitter;

  constructor(
    protected jobsService: JobsService,
    protected inputService: InputService,
    protected dialogService: DialogService,
    protected sequenceDiagramService: SequenceDiagramService,
    protected sequenceDiagramController: SequenceDiagramController,
    protected lifelinesController: LifelinesController,
    protected layersController: LayersController,
    protected messagesController: MessagesController
  ) {
    // Set self to services and controllers
    this.sequenceDiagramService.menuComponent = this;
    this.sequenceDiagramController.menuComponent = this;
    this.lifelinesController.menuComponent = this;
    this.layersController.menuComponent = this;
    this.messagesController.menuComponent = this;
  }

  // Load sequence diagrams
  protected sequenceDiagrams: M.Interaction[];

  public ngOnInit() {
    this.menuReload$.subscribe(
      () => this.loadSequenceDiagrams()
    );
  }

  protected loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: M.Interaction[]) => {
        this.sequenceDiagrams = diagrams;
      }
    );
  }

  // Change "View" and "Edit" mode
  protected selectedTabIndex: number = 0;

  public get editMode(): boolean {
    return this.selectedTabIndex == 1;
  }

  public set editMode(editMode: boolean) {
    this.selectedTabIndex = editMode ? 1 : 0;
  }

  protected changeTab(event) {
    this.selectedTabIndex = (event.tab.textLabel == 'Edit') ? 1 : 0;
  }

  // Open operations
  protected openedSequenceDiagram: M.Interaction;

  public openSequenceDiagram(sequenceDiagram: M.Interaction) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.onOpenSequenceDiagram.emit(sequenceDiagram);
  }

  // Refresh
  protected menuReloadSource = new BehaviorSubject<any>(null);
  protected menuReload$ = this.menuReloadSource.asObservable();

  public refresh(callback?: any): void {
    this.jobsService.start('menu.component.refresh');
    this.menuReloadSource.next(null);
    if (callback) callback();
    this.jobsService.finish('menu.component.refresh');
  }





  // Delete operations
  protected deleteComponent() {
    this.sequenceDiagramService.performDelete();
  }
}
