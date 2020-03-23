import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { first, map, filter } from 'rxjs/operators';

import * as _ from 'lodash';

// import 'firebase/firestore';

import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class ClaimsService {
    // <<<<<<< HEAD
    private claimsCollection: AngularFirestoreCollection<Claim>;
    claims: Observable<Claim[]>;
    claim: Observable<Claim>;

    //documents from fire storage
    documents: Observable<Document[]>;
    document: Observable<Document>;

    constructor(
        private firebase: AngularFirestore,
        private storage: AngularFireStorage
    ) {
        this.claimsCollection = firebase.collection<Claim>('claims');
        this.claims = this.claimsCollection.valueChanges();
    }

    async addClaim(claim: Claim): Promise<void> {
        this.claims.pipe(first()).subscribe(async claims => {
            claim.claimId = this.generateCliamID('BR20200012', claims.length);
            //await this.claimsCollection.add(claim)
            await this.claimsCollection.doc(claim.claimId).set(claim);
        });
    }

    //  getPendingClaims(): Observable<Claim[]> {
    //    return this.claimsCollection = this.firebase.collection('claims', ref => ref.where('status', '==', 'Pending'));
    //  }

    getClaims(): Observable<Claim[]> {
        return this.claims;
    }

    //get files from firebase storage
    getFiles(): Observable<Document[]> {
        return this.documents;
    }

    //update document field in claims collection with provided url
    //  updateClaimDoc(claimId: string, url: string): void {
    //    console.log(claimId);
    //     this.firebase.collection('claims').doc(claimId).update({
    //       document: url,
    //       status: "resolved",
    //     })
    //  }
    updateClaimDoc(claimId: string, claim: Claim): void {
        console.log(claimId);
        this.firebase
            .collection('claims')
            .doc(claimId)
            .update(claim);
    }

    //get single claim by cliam id
    getClaim(id: string): Observable<Claim> {
        // const result = this.claims.pipe(filter(map(x => _.find(y, y => y.c))));
        const result = this.claims.pipe(
            map(claim => claim.find(x => x.claimId === id))
        );
        return result;
    }

    countGenerator(number) {
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
            ('0' + today.getDate()).slice(-2);

        return 'CL' + broker_name + dateString + count;
    }
    // =======
    //     private claimsCollection: AngularFirestoreCollection<Claim>;
    // >>>>>>> bc5322423ef431a8932c5f00048a9ceff2eed018
    //     claims: Observable<Claim[]>;

    //     constructor(private firestore: AngularFirestore) {
    //         this.claimsCollection = this.firestore.collection<Claim>('claims');
    //         this.claims = this.claimsCollection.valueChanges();
    //     }

    //     async addClaim(claim: Claim): Promise<void> {
    //         this.claims.pipe(first()).subscribe(async claims => {
    //             claim.id = v4();
    //             claim.claimId = this.generateCliamID('BR20200012', claims.length);

    //             // this.claimsCollection
    //             await this.claimsCollection.add(claim);
    //         });
    //     }

    //     async updateClaim(id: string): Promise<void> {
    //         const cliam = this.firestore.doc<Claim>(`claims/${id}`);
    //     }

    //     getClientsClaims(clientId: string): Observable<Claim[]> {
    //         return this.claims.pipe(filter(claim => clientId === clientId));
    //     }

    //     getClaims(): Observable<Claim[]> {
    //         console.log(this.claims);
    //         return this.claims;
    //     }

    //     countGenerator(number: string | number): string | number {
    //         if (number <= 9999) {
    //             number = ('0000' + number).slice(-5);
    //         }
    //         return number;
    //     }

    //     //generate cliam ID
    //     generateCliamID(brokerName: string, totalClaims: number): string {
    //         const broker_name = brokerName.substring(0, 2).toLocaleUpperCase();
    //         const count = this.countGenerator(totalClaims);
    //         const today = new Date();
    //         const dateString: string =
    //             today
    //                 .getFullYear()
    //                 .toString()
    //                 .substr(-2) +
    //             ('0' + (today.getMonth() + 1)).slice(-2) +
    //             +('0' + today.getDate()).slice(-2);
    // >>>>>>> 06e7fbebfa4286c6af3a7e117103027e84398a08

    // return 'CL' + broker_name + dateString + count;
    // }
}
