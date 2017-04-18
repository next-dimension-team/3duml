import '../styles/styles.scss';
import 'hammerjs';
import 'hammerjs';
import { AppComponent } from './app.component';
import { APP_CONFIG, AppConfig } from './app.config';
import { AppState, InternalStateType } from './app.service';
import { ConfigPipe } from './config';
import { ConfigService } from './config';
import { Datastore } from './datastore';
import { ConfirmDialogComponent } from './dialog/components/confirm-dialog.component';
import { EditDialogComponent } from './dialog/components/edit-dialog.component';
import { HelpDialogComponent } from './dialog/components/help-dialog.component';
import { DialogService } from './dialog/services';
import { ENV_PROVIDERS } from './environment';
import { MenuComponent } from './menu/components/menu.component';
import { HelpComponent } from './menu/components/help.component';
import { CombinedFragmentComponent } from './sequence-diagram/components/combined-fragment.component';
import { ExecutionComponent } from './sequence-diagram/components/execution.component';
import { InteractionFragmentComponent } from './sequence-diagram/components/interaction-fragment.component';
import { InteractionOperandComponent } from './sequence-diagram/components/interaction-operand.component';
import { LayerComponent } from './sequence-diagram/components/layer.component';
import { LifelineComponent } from './sequence-diagram/components/lifeline.component';
import { MessageComponent } from './sequence-diagram/components/message.component';
import { SequenceDiagramComponent } from './sequence-diagram/components/sequence-diagram.component';
import { LayersController, LifelinesController, SequenceDiagramController } from './sequence-diagram/controllers';
import { MessagesController } from './sequence-diagram/controllers/messages.controller';
import { SelectableDirective } from './sequence-diagram/directives/selectable.directive';
import { InputService, JobsService, SequenceDiagramService } from './sequence-diagram/services';
import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { JsonApiModule } from '../jsonapi';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  Datastore,
  InputService,
  DialogService,
  SequenceDiagramService,
  JobsService,
  { provide: APP_CONFIG, useValue: AppConfig },
  ConfigService
];

// Application controllers
const APP_CONTROLLERS = [
  SequenceDiagramController,
  LayersController,
  LifelinesController,
  MessagesController
]

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    // Components
    AppComponent,
    MenuComponent,
    HelpComponent,
    SequenceDiagramComponent,
    LifelineComponent,
    ExecutionComponent,
    MessageComponent,
    CombinedFragmentComponent,
    InteractionOperandComponent,
    LayerComponent,
    InteractionFragmentComponent,
    EditDialogComponent,
    ConfirmDialogComponent,
    HelpDialogComponent,
    ConfigPipe,

    // Directives
    SelectableDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonApiModule,
    MaterialModule
  ],
  entryComponents: [
    EditDialogComponent,
    ConfirmDialogComponent,
    HelpDialogComponent
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    APP_CONTROLLERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    //console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
