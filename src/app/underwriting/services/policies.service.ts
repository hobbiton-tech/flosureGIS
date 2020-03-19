import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PoliciesService {
    private policiesCollection: AngularFirestoreCollection<Policy>;
    policies: Observable<Policy[]>;

    constructor(private firebase: AngularFirestore) {
        this.policiesCollection = firebase.collection<Policy>('policies');
        this.policies = this.policiesCollection.valueChanges();
    }

    getPolicies(): Observable<Policy[]> {
        return this.policies;
    }

    getClientsPolicies(clientId: string): Observable<Policy[]> {
        return this.policies.pipe(filter(policy => clientId === clientId));
    }

    countGenerator(number) {
        if (number <= 9999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    //Generating Policy Number
    generatePolicyNumber(brokerName: string, totalPolicies: number) {
        const broker_name = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalPolicies);
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);

        return 'PO' + broker_name + dateString + count;
    }
}
