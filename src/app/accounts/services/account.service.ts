import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private receiptsCollection: AngularFirestoreCollection<Policy>;
    receipts: Observable<Policy[]>;

    constructor(private firebase: AngularFirestore) {
        this.receiptsCollection = firebase.collection<Policy>('policies');
        this.receipts = this.receiptsCollection.valueChanges();
    }

    getReceipts(): Observable<Policy[]> {
        return this.receipts;
    }
}
