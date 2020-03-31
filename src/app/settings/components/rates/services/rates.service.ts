import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { IRate } from '../models/rates.model';
import { first } from 'rxjs/operators';
import { v4 } from 'uuid';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  private ratesCollection: AngularFirestoreCollection<IRate>;
  rates: Observable<IRate[]>

  constructor(
    private firebase: AngularFirestore) {
      this.ratesCollection = firebase.collection<IRate>('rates');
      this.rates = this.ratesCollection.valueChanges();
     }

     //add rate to rates collection
     async addRate(rate: IRate): Promise<void> {
       this.rates.pipe(first())
       .subscribe(async rates => {
         rate.id = v4();
         await this.ratesCollection.doc(rate.id).set(rate);
       })
     }

     getRates(): Observable<IRate[]> {
       return this.rates;
     }
}
