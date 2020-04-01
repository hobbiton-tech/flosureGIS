import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Peril } from '../models/peril.model';


@Injectable({
    providedIn: 'root'
  })
  export class PerilService {
      private perilsCollection: AngularFirestoreCollection<Peril>;
      perils: Observable<Peril[]>;

      constructor(private firebase: AngularFirestore) {
        this.perilsCollection = firebase.collection<Peril>('perils');
        this.perils = this.perilsCollection.valueChanges();
      }

      getPerils(): Observable<Peril[]> {
          return this.perils;
      }

      addPeril(peril: Peril): void {
          this.perilsCollection.add(peril);
      }
  }
