import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private recieptsCollection: AngularFirestoreCollection<Policy>;
    reciepts: Observable<Policy[]>;

    constructor(private firebase: AngularFirestore) {
        this.recieptsCollection = firebase.collection<Policy>('policies');
        this.reciepts = this.recieptsCollection.valueChanges();
    }

    getReciepts(): Observable<Policy[]> {
        return this.reciepts;
    }
}
