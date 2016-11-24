import { Injectable } from '@angular/core';
import { Interaction } from '../models';
import { Datastore } from '../../datastore';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class InteractionService {

  constructor(private datastore: Datastore) { }

  getAll(): Promise<Interaction[]> {
    return this.datastore.query(Interaction).toPromise();
  }

  getById(id: number): Promise<Interaction> {
    return this.datastore.findRecord(Interaction, id.toString()).toPromise();
  }

  getSequenceDiagrams(): Promise<Interaction[]> {
    // TODO: vrati take interakcie, ktore NEMAJU rodica
    // toto treba doimplementovat
    return this.getAll();
  }

  getAllChildren(): Promise<Interaction[]> {
    // TODO: vrati take interakcie ktore MAJU rodica, teda nie su sekvencny diagram
    // toto treba doimplementovat
    // tiez by bolo asi dobre tu metodu premenovat
    return this.getAll();
  }

}
