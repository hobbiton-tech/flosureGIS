import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { v4 } from 'uuid';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { isTemplateRef } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root',
})
export class PoliciesService {
    private policiesCollection: AngularFirestoreCollection<Policy>;
    policies: Observable<Policy[]>;
    policy: any;

    constructor(private firebase: AngularFirestore) {
        this.policiesCollection = firebase.collection<Policy>('policies');
        this.policies = this.policiesCollection.valueChanges();
    }

    async addPolicy(policy: Policy) {
        this.policies.pipe(first()).subscribe(async (policies) => {
            const today = new Date();
            policy.nameOfInsured = policy.client;
            policy.dateOfIssue =
                today.getDay() +
                '-' +
                today.getMonth() +
                '-' +
                today.getFullYear();
            policy.timeOfIssue = today.getHours() + ':' + today.getMinutes();
            policy.expiryDate = policy.endDate;
            policy.status = 'Active';
            // policy.policyNumber = this.generatePolicyNumber(
            //     'BR202000030',
            //     policies.length
            // );
            policy.id = v4();
            // This is the easiest way I found to track the policy number / client Id
            // for the PDFs generation.
            localStorage.removeItem('policyNumber');
            localStorage.setItem('policyNumber', policy.policyNumber);

            localStorage.removeItem('clientId');
            localStorage.setItem('clientId', policy.nameOfInsured); // TODO: Need to change to client code.

            this.policiesCollection.doc(policy.id).set(policy);
        });
    }

    // get single risk
    getPolicy(policyNumber: string): Promise<void> {
        this.firebase
            .collection('policies')
            .ref.where('policyNumber', '==', policyNumber)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    this.policy = doc.data();
                });
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });

        return this.policy;
    }

    getPolicyNumber() {
        return this.policies;
    }

    getPolicyById(policyId: string): Observable<Policy> {
        return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    }

    getClientsPolicies(clientId: string): Observable<Policy[]> {
        return this.policies.pipe(filter((policy) => clientId === clientId));
    }

    getPolicies(): Observable<Policy[]> {
        return this.policies;
    }

    countGenerator(number) {
        if (number <= 9999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    // Generating Policy Number
    generatePolicyNumber(brokerName: string, totalPolicies: number) {
        const broker_name = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalPolicies);
        const today = new Date();
        const dateString: string =
            today.getFullYear().toString().substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);

        return 'PO' + broker_name + dateString + count;
    }
}
