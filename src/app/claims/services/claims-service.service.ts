import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../models/claim.model'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private claimsCollection: AngularFirestoreCollection<Claim>;
  claims: Observable<Claim[]>;

  constructor(private firebase: AngularFirestore) {
    this.claimsCollection = firebase.collection<Claim>('claims');
    this.claims = this.claimsCollection.valueChanges();
   }

   addClaim(claim: Claim): void {
     this.claimsCollection.add(claim)
   }

  //  getPendingClaims(): Observable<Claim[]> {
  //    return this.claimsCollection = this.firebase.collection('claims', ref => ref.where('status', '==', 'Pending'));
  //  }

   getClaims(): Observable<Claim[]> {
     return this.claims;
   }
}
