import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { first} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ClaimsService {

    private claimsCollection: AngularFirestoreCollection<Claim>;
    claims: Observable<Claim[]>;
    claim: Observable<Claim>;

    constructor(
        private firebase: AngularFirestore,
        private storage: AngularFireStorage
    ) {
        this.claimsCollection = firebase.collection<Claim>('claims');
        this.claims = this.claimsCollection.valueChanges();
    }

    async addClaim(claim: Claim): Promise<void> {
        this.claims.pipe(first()).subscribe(async claims => {
            claim.claimId = this.generateClaimID('BR20200012', claims.length);
            await this.claimsCollection.doc(claim.claimId).set(claim);
        });
    }

    getClaims(): Observable<Claim[]> {
        return this.claims;
    }

    updateClaimDoc(claimId: string, claim: Claim): Promise<void> {
        console.log(claimId);
        return this.firebase
            .collection('claims')
            .doc(claimId)
            .update(claim);
    }

    countGenerator(num: number | string) {
        if (num <= 9999) {
            num = ('0000' + num).slice(-5);
        }
        return num;
    }

    generateClaimID(name: string, totalClaims: number): string {
        const brokerName = name.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalClaims);
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            ('0' + today.getDate()).slice(-2);

        return 'CL' + brokerName + dateString + count;
    }
}
