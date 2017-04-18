import { DialogService } from '../../dialog/services';
import { LayersController, LifelinesController, SequenceDiagramController } from '../../sequence-diagram/controllers';
import { MessagesController } from '../../sequence-diagram/controllers/messages.controller';
import * as M from '../../sequence-diagram/models';
import { JobsService } from '../../sequence-diagram/services';
import { SequenceDiagramService } from '../../sequence-diagram/services';
import { InputService } from '../../sequence-diagram/services/input.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StoreResource } from 'ngrx-json-api';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  // Events
  @Output() public onOpenSequenceDiagram = new EventEmitter();
  @Output() public onModeChange = new EventEmitter();

  // Editing layer
  public editingLayer: M.InteractionFragment = null;

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
    this.sequenceDiagramController.menuComponent = this;
    this.lifelinesController.menuComponent = this;
    this.layersController.menuComponent = this;
    this.messagesController.menuComponent = this;
  }

  // Load sequence diagrams
  protected sequenceDiagrams: StoreResource[];

  public ngOnInit() {
    this.menuReload$.subscribe(
      () => this.loadSequenceDiagrams()
    );
  }

  protected loadSequenceDiagrams() {
    this.sequenceDiagramService.getSequenceDiagrams().subscribe(
      (diagrams: StoreResource[]) => {
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
    this.onModeChange.emit(this.editMode);
  }

  // Open operations
  protected openedSequenceDiagram: StoreResource;

  public openSequenceDiagram(sequenceDiagram: StoreResource) {
    this.openedSequenceDiagram = sequenceDiagram;
    this.onOpenSequenceDiagram.emit(sequenceDiagram);
  }

  // Refresh
  protected menuReloadSource = new BehaviorSubject<any>(null);
  protected menuReload$ = this.menuReloadSource.asObservable();

  /*
   * Refresh menu component
   */
  public refresh(callback?: any): void {
    this.jobsService.start('menu.component.refresh');
    this.menuReloadSource.next(null);
    if (callback) callback();
    this.jobsService.finish('menu.component.refresh');
  }

}
