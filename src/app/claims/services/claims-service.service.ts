import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { filter, first, take } from 'rxjs/operators';

// import 'firebase/firestore';

import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class ClaimsService {
    claimsCollection: AngularFirestoreCollection<Claim>;
    claims: Observable<Claim[]>;

    constructor(private firestore: AngularFirestore) {
        this.claimsCollection = this.firestore.collection<Claim>('claims');
        this.claims = this.claimsCollection.valueChanges();
    }

    async addClaim(claim: Claim): Promise<void> {
        this.claims.pipe(first()).subscribe(async claims => {
            claim.id = v4();
            claim.claimId = this.generateCliamID('BR20200012', claims.length);

            // this.claimsCollection
            await this.claimsCollection.add(claim);
        });
    }

    async updateClaim(id: string): Promise<void> {
        const cliam = this.firestore.doc<Claim>(`claims/${id}`);
    }

    getClientsClaims(clientId: string): Observable<Claim[]> {
        return this.claims.pipe(filter(claim => clientId === clientId));
    }

    getClaims(): Observable<Claim[]> {
        console.log(this.claims);
        return this.claims;
    }

    countGenerator(number: string | number): string | number {
        if (number <= 9999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    //generate cliam ID
    generateCliamID(brokerName: string, totalClaims: number): string {
        const broker_name = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalClaims);
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);

        return 'CL' + broker_name + dateString + count;
    }
}
