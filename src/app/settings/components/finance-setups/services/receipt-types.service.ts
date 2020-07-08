import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';
import { promise } from 'protractor';
import {IReceiptTypes} from 'src/app/settings/models/finance/receipt-types.model'


@Injectable({
  providedIn: 'root'
})
export class ReceiptTypesService {
  private receiptTypeCollection: AngularFirestoreCollection<IReceiptTypes>;
  receiptTypes: Observable<IReceiptTypes[]>;
 

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) {
    this.receiptTypeCollection = firebase.collection<IReceiptTypes>('receiptTypes');
    this.receiptTypes = this.receiptTypeCollection.valueChanges();
  
   }

  // receipt Methods
  async addReceiptType(receiptType: IReceiptTypes): Promise<void> {
    await this.receiptTypeCollection
        .doc(receiptType.id)
        .set(receiptType)
        .then((mess) => {
            this.message.success('Receipt-Type Successfully created');
        })
        .catch((err) => {
            this.message.warning('Receipt creation Failed');
            console.log(err);
        });
}

async updateReceiptType(receiptType: IReceiptTypes): Promise<void> {
  return this.receiptTypeCollection
      .doc(`${receiptType.id}`)
      .update(receiptType)
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      });

}

getReceiptTypes(): Observable<IReceiptTypes[]>{
return this.receiptTypes
}
}






