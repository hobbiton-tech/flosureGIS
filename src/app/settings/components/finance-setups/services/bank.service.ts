import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBank } from '../../../models/finance/bank.model'
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private bankCollection: AngularFirestoreCollection<IBank>;
  banks: Observable<IBank[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) { 
    this.bankCollection = firebase.collection<IBank>('banks');
    this.banks = this.bankCollection.valueChanges();
  }

  // getBanks(): Observable<IBank[]> {
  //   return this.http.get<IBank[]>(`${BASE_URL}/banks`)
  // }


  // Bank Methods
  async addBank(bank: IBank): Promise<void>{
    await this.bankCollection
    .doc(bank.id)
    .set(bank)
    .then((mess) => {
      this.message.success('Bank Successfullt Added')
    })
    .catch((err) => {
      this.message.warning('Bank Creeation failed')
      console.log(err);
    });
  }

 
  async updateBank(bank: IBank): Promise<void> {
    return this.bankCollection
        .doc(`${bank.id}`)
        .update(bank)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
}


getBank(): Observable<IBank[]> {
    return this.banks;}


}
