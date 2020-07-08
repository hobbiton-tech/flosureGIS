import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';
import { IPaymentMethod } from 'src/app/settings/models/finance/payment-methodes.model';


//const BASE_URL = 'https://flosure-api.azurewebsites.net';
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private paymentMethodCollection: AngularFirestoreCollection<IPaymentMethod>;
  paymentMethods: Observable<IPaymentMethod[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) { 
    this.paymentMethodCollection = firebase.collection<IPaymentMethod>('paymentMethods');
    this.paymentMethods = this.paymentMethodCollection.valueChanges();
  }

  // getPaymentMethods(): Observable<IPaymentMethod[]> {
  //   return this.http.get<IPaymentMethod[]>(`/paymentMethods`);


      // Payment Methods
      async addPaymentMethod(paymentMethod: IPaymentMethod): Promise<void> {
        await this.paymentMethodCollection
            .doc(paymentMethod.id)
            .set(paymentMethod)
            .then((mess) => {
                this.message.success('Payment Successfully created');
            })
            .catch((err) => {
                this.message.warning('Payment created Failed');
                console.log(err);
            });
    }

    async updatePaymentMethod(paymentMethod: IPaymentMethod): Promise<void> {
      return this.paymentMethodCollection
          .doc(`${paymentMethod.id}`)
          .update(paymentMethod)
          .then((res) => {
              console.log(res);
          })
          .catch((err) => {
              console.log(err);
          });

  }

  getPaymentMethods(): Observable<IPaymentMethod[]>{
    return this.paymentMethods
  }
}
