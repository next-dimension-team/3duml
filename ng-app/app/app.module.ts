import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JsonApiModule } from 'angular2-jsonapi';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

// Platform and Environment providers/directives/pipes
import { ENV_PROVIDERS } from './environment';

// App components
import { AppComponent } from './app.component';
import { LifelineComponent } from './sequence-diagram/components/lifeline.component';
import { ExecutionComponent } from './sequence-diagram/components/execution.component';
import { MessageComponent } from './sequence-diagram/components/message.component';
import { FragmentComponent } from './sequence-diagram/components/fragment.component';
import { OperandComponent } from './sequence-diagram/components/operand.component';
import { LayerComponent } from './sequence-diagram/components/layer.component';
import { InputTextComponent } from './sequence-diagram/components/input.text.component';

// Component for menu
import { MenuComponent } from './menu/components/menu.component';
import { SequenceDiagramComponent } from './sequence-diagram/components/sequence.diagram.component';
import { AppState, InternalStateType } from './app.service';
import { Datastore } from './datastore';

// Global styles
import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  Datastore
];

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
    AppComponent,
    MenuComponent,
    SequenceDiagramComponent,
    LifelineComponent,
    ExecutionComponent,
    MessageComponent,
    FragmentComponent,
    OperandComponent,
    LayerComponent,
    InputTextComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonApiModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) {}

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
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
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
