import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { IRate, ITax } from '../models/rates.model';
import { first } from 'rxjs/operators';
import { v4 } from 'uuid';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  //Rates
  private ratesCollection: AngularFirestoreCollection<IRate>;
  rates: Observable<IRate[]>

  //Taxes
  private taxesCollection: AngularFirestoreCollection<ITax>;
  taxes: Observable<ITax[]>

  constructor(
    private firebase: AngularFirestore) {
      this.ratesCollection = firebase.collection<IRate>('rates');
      this.rates = this.ratesCollection.valueChanges();

      this.taxesCollection = firebase.collection<ITax>('taxes');
      this.taxes = this.taxesCollection.valueChanges();
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

     //add taxes to taxes collection
     async addTaxes(tax: ITax): Promise<void> {
       this.taxes.pipe(first())
       .subscribe(async taxes => {
         tax.id = v4();
         await this.taxesCollection.doc(tax.id).set(tax);
       })
     }

     getTaxes(): Observable<ITax[]> {
      return this.taxes;
    }
}
