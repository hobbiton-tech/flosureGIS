import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClaimsService {
    private claimsCollection: AngularFirestoreCollection<Claim>;
    claims: Observable<Claim[]>;

    constructor(private firebase: AngularFirestore) {
        this.claimsCollection = this.firebase.collection<Claim>('claims');
        this.claims = this.claimsCollection.valueChanges();
    }

    addClaim(claim: Claim): void {
        this.claimsCollection.add(claim);
    }

    getClaims(): Observable<Claim[]> {
        return this.claims;
    }

    getClientsClaims(clientId: string): Observable<Claim[]> {
        return this.claims.pipe(filter(claim => clientId === clientId));
    }
}
