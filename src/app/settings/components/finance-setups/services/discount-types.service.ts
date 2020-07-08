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
import {IDiscountType} from 'src/app/settings/models/finance/discount-type.model'


@Injectable({
  providedIn: 'root'
})
export class DiscountTypesService {
  private discountTypeCollection: AngularFirestoreCollection<IDiscountType>
  discountTypes: Observable<IDiscountType[]>;
 
  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) {
    this.discountTypeCollection = firebase.collection<IDiscountType>('discountTypes');
    this.discountTypes = this.discountTypeCollection.valueChanges();
  
   }



  // Discount Methods
  async addDiscountType(discountType: IDiscountType): Promise<void> {
    await this.discountTypeCollection
        .doc(discountType.id)
        .set(discountType)
        .then((mess) => {
            this.message.success('Discount-Type Successfully created');
        })
        .catch((err) => {
            this.message.warning('Discount creation Failed');
            console.log(err);
        });
}

async updateDiscountType(discountType: IDiscountType): Promise<void> {
  return this.discountTypeCollection
      .doc(`${discountType.id}`)
      .update(discountType)
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      });

}

getDiscountType(): Observable<IDiscountType[]>{
return this.discountTypes
}
}






