import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  private policiesCollection: AngularFirestoreCollection<Policy>;
  policies: Observable<Policy[]>

  constructor(private firebase: AngularFirestore) {
    this.policiesCollection = firebase.collection<Policy>('policies');
    this.policies = this.policiesCollection.valueChanges();
   }

   getPolicies(): Observable<Policy[]> {
     return this.policies
   }
}
