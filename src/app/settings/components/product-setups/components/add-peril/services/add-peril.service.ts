import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore,
} from '@angular/fire/firestore';
import { IPeril } from '../../../models/product-setups-models.model';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

const BASE_URL = 'https://flosure-api.azurewebsites.net';
@Injectable({
    providedIn: 'root',
})
export class AddPerilService {
    private perilCollection: AngularFirestoreCollection<IPeril>;
    perils: Observable<IPeril[]>;

    constructor(
        private firebase: AngularFirestore,
        private message: NzMessageService
    ) {
        this.perilCollection = firebase.collection<IPeril>('perils');
        this.perils = this.perilCollection.valueChanges();
    }

    async addPeril(peril: IPeril): Promise<void> {
        await this.perilCollection
            .doc(peril.id)
            .set(peril)
            .then((mess) => {
                this.message.success('Peril Successfuly Created');
            })
            .catch((err) => {
                this.message.warning('Peril Failed to Create');
                console.log(err);
            });
    }

    async updatePeril(peril: IPeril): Promise<void> {
        return this.perilCollection
            .doc(`${peril.id}`)
            .update(peril)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                this.message.warning('Update Failed');
                console.log(err);
            });
    }

    getPerils(): Observable<IPeril[]> {
        return this.perils;
    }
}
