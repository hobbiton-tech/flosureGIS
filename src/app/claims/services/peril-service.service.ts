import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { first, map, filter } from 'rxjs/operators';
import { Peril } from '../models/peril.model';

import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
  })
  export class PerilService {
      private perilsCollection: AngularFirestoreCollection<Peril>;
      perils: Observable<Peril[]>;
      peril: Observable<Peril>;

      constructor(private firebase: AngularFirestore) {
        this.perilsCollection = firebase.collection<Peril>('perils');
        this.perils = this.perilsCollection.valueChanges();
      }
      
      //return all perils
      getPerils(): Observable<Peril[]> {
          return this.perils;
      }

      //return all perils matching given id
      getFilteredPerils(id: string): Observable<Peril[]> {
        const result = this.perils.pipe(map(claim => claim.filter(x => x.claimId === id)));
          return result;
      }

      //add Peril to Perils collection
      addPeril(peril: Peril): void {
          this.perilsCollection.add(peril);
      }
  }