import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root',
})
export class ClaimsService {
    private claimsCollection: AngularFirestoreCollection<Claim>;
    claims: Observable<Claim[]>;

    constructor(
        private firebase: AngularFirestore,
        private message: NzMessageService
    ) {
        this.claimsCollection = firebase.collection<Claim>('claims');
        this.claims = this.claimsCollection.valueChanges();
    }

    // Add Claim
    async addClaim(claim: Claim): Promise<void> {
        await this.claimsCollection
            .doc(claim.id)
            .set(claim)
            .then((msg) => {
                this.message.success('Claim Successfully Created');
            })
            .catch((err) => {
                this.message.warning('Failed to Create');
                console.log(err);
            });
    }

    async updateClaim(claim: Claim): Promise<void> {
        return this.claimsCollection
            .doc(`${claim.id}`)
            .update(claim)
            .then((res) => {
                this.message.success('Claim Successfully Updated');
            })
            .catch((err) => {
                this.message.warning('Failed to Update');
                console.log(err);
            });
    }

    getClaims(): Observable<Claim[]> {
        return this.claims;
    }
}
