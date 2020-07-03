import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import {ICoverType} from '../../../models/product-setups-models.model';

const BASE_URL = 'https://flosure-api.azurewebsites.net';
@Injectable({
  providedIn: 'root'
})
export class AddCoverTypeService {
  private coverTypeCollection: AngularFirestoreCollection<ICoverType>;
    coverTypes: Observable<ICoverType[]>;

  constructor(
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) {
    this.coverTypeCollection = firebase.collection<ICoverType>('coverTypes');
    this.coverTypes = this.coverTypeCollection.valueChanges();
   }

   async addCoverType(coverType: ICoverType): Promise<void> {
    await this.coverTypeCollection
        .doc(coverType.id)
        .set(coverType)
        .then((mess) => {
            this.message.success('Cover Type Successfuly Created');
        })
        .catch((err) => {
            this.message.warning('Cover Type Failed to Create');
            console.log(err);
        });
}

async updateCoverType(coverType: ICoverType): Promise<void> {
  return this.coverTypeCollection
      .doc(`${coverType.id}`)
      .update(coverType)
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          this.message.warning('Update Failed');
          console.log(err);
      });
}

getCoverTypes(): Observable<ICoverType[]> {
  return this.coverTypes;
}





}
