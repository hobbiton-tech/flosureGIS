import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';
import { IBank } from 'src/app/settings/models/finance/bank.model';


const BASE_URL = 'https://flosure-api.azurewebsites.net';
@Injectable({
  providedIn: 'root'
})
export class BankService {
  [x: string]: any;
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

   
    // Banks Methods
    async addBank(bank: IBank): Promise<void> {
      await this.bankCollection
          .doc(bank.id)
          .set(bank)
          .then((mess) => {
              this.message.success('Clause Successfully created');
          })
          .catch((err) => {
              this.message.warning('Clause Failed');
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

  getBanks(): Observable<IBank[]> {
      return this.banks;
  }






}
