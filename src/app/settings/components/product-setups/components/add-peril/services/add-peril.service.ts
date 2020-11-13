import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore,
} from '@angular/fire/firestore';
import { IPeril } from '../../../models/product-setups-models.model';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://test-main.flosure-api.com';
@Injectable({
    providedIn: 'root',
})
export class AddPerilService {
    private perilCollection: AngularFirestoreCollection<IPeril>;
    perils: Observable<IPeril[]>;

    constructor(
        private firebase: AngularFirestore,
        private message: NzMessageService,
        private http: HttpClient
    ) {
        this.perilCollection = firebase.collection<IPeril>('perils');
        this.perils = this.perilCollection.valueChanges();
    }

    addPeril(peril: IPeril): Observable<IPeril> {
      return this.http.post<IPeril>(`${BASE_URL}/perils/${peril.productId}`, peril);
        // await this.perilCollection
        //     .doc(peril.id)
        //     .set(peril)
        //     .then((mess) => {
        //         this.message.success('Peril Successfuly Created');
        //     })
        //     .catch((err) => {
        //         this.message.warning('Peril Failed to Create');
        //         console.log(err);
        //     });
    }

    updatePeril(peril: IPeril): Observable<IPeril> {
        return this.http.put<IPeril>(`${BASE_URL}/perils/${peril.id}`, peril);
      // this.perilCollection
      //       .doc(`${peril.id}`)
      //       .update(peril)
      //       .then((res) => {
      //           console.log(res);
      //       })
      //       .catch((err) => {
      //           this.message.warning('Update Failed');
      //           console.log(err);
      //       });
    }

    getPerils(): Observable<IPeril[]> {
        return this.http.get<IPeril[]>(`${BASE_URL}/perils`);
      // this.perils;
    }
}
