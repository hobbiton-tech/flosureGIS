import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { v4 } from 'uuid';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { isTemplateRef, NzMessageService } from 'ng-zorro-antd';

import { HttpClient } from '@angular/common/http';
import {
    DebitNote,
    CreditNote,
    CoverNote
} from '../documents/models/documents.model';


const BASE_URL = 'https://www.flosure-api.com';

// const BASE_URL = 'http://localhost:3000';


interface IDebitNoteResult {
    invoiceNumber: string;
}

interface ICreditNoteResult {
    invoiceNumber: string;
}

interface ICoverNoteResult {
    coverNoteNumber: string;
}

@Injectable({
    providedIn: 'root'
})
export class PoliciesService {
    private policiesCollection: AngularFirestoreCollection<Policy>;
    policies: Observable<Policy[]>;
    policy: any;
    getDNote:any;

    constructor(
        private firebase: AngularFirestore,
        private msg: NzMessageService,
        private http: HttpClient
    ) {
        this.policiesCollection = firebase.collection<Policy>('policies');
        this.policies = this.policiesCollection.valueChanges();
    }

    // postgres db
    ///////////////////////
    createPolicy(policy: Policy): Observable<Policy> {
        let insuranceType = '';
        const productType = policy.risks[0].insuranceType;
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        return this.http.post<Policy>(
            'https://www.flosure-api.com/policy',
            policy
        );
    }

    // getPolicies(): Observable<Policy[]> {
    //     return this.http.get<Policy[]>('https://www.flosure-api.com/policy');
    // }

    // getPolicyById(policyId: string): Observable<Policy> {
    //     return this.http.get<Policy>(
    //         `https://www.flosure-api.com/policy/${policyId}`
    //     );
    //     return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    // }

    updatePolicy(policy: Policy): Observable<Policy> {
        console.log('POLICY NUMBER>>>>', policy);
        return this.http.put<Policy>(
            `https://www.flosure-api.com/policy/${policy.id}`,
            policy
        );
    }

    // backup policies
    createBackupPolicy(policy: Policy): Observable<Policy> {
        return this.http.post<Policy>(
            'https://www.flosure-api.com/policy',
            policy
        );
    }

    getBackupPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>('https://www.flosure-api.com/policy');
    }

    getBackupPolicyById(policyId: string): Observable<Policy> {
        return this.http.get<Policy>(
            `https://www.flosure-api.com/policy/${policyId}`
        );
        // return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    }

    updateBackupPolicy(policy: Policy, policyId: string): Observable<Policy> {
        console.log('policy details:');
        console.log(policy);
        return this.http.put<Policy>(
            `https://www.flosure-api.com/policy/${policyId}`,
            policy
        );
    }

    ////////////////////////////////////////////

    async addPolicy(policy: Policy) {
        this.policies.pipe(first()).subscribe(async policies => {
            const today = new Date();
            policy.term = 1;
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

    renewPolicy(policy: Policy) {
        this.policies.pipe(first()).subscribe(async policies => {
            const today = new Date();
            policy.client = policy.nameOfInsured;
            policy.dateOfIssue =
                today.getDay() +
                '-' +
                today.getMonth() +
                '-' +
                today.getFullYear();
            policy.timeOfIssue = today.getHours() + ':' + today.getMinutes();
            policy.expiryDate = policy.endDate;
            policy.status = 'Active';
            localStorage.removeItem('policyNumber');
            localStorage.setItem('policyNumber', policy.policyNumber);
            localStorage.removeItem('clientId');
            localStorage.setItem('clientId', policy.nameOfInsured); // TODO: Need to change to client code.
            console.log('POLICY NUMBER>>>>', policy.id);
            console.log(policy);
            this.http
                .put<Policy>(
                    `https://www.flosure-api.com/policy/${policy.id}`,
                    policy
                )
                .subscribe(
                    data => {
                        this.msg.success('Policy Successfully Updated');
                    },
                    error => {
                        this.msg.error('Failed');
                    }
                );

            // this.policiesCollection
            //     .doc(policy.id)
            //     .update(policy)
            //     .then((res) => {
            //         this.msg.success('Policy Successfully Updated');
            //     })
            //     .catch(() => {
            //         this.msg.error('Failed');
            //     });
        });
    }

    // get single risk
    getPolicy(policyNumber: string): Promise<void> {
        this.firebase
            .collection('policies')
            .ref.where('policyNumber', '==', policyNumber)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    this.policy = doc.data();
                });
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
            });

        return this.policy;
    }

    getPolicyNumber() {
        return this.policies;
    }

    getPolicyById(policyId: string): Observable<Policy> {
        return this.http.get<Policy>(
            `https://www.flosure-api.com/policy/${policyId}`
        );

        // return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    }

    getClientsPolicies(clientId: string): Observable<Policy[]> {
        return this.policies.pipe(filter(policy => clientId === clientId));
    }

    getPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>('https://www.flosure-api.com/policy');
        // return this.policies;
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
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);

        return 'PO' + broker_name + dateString + count;
    }

    //documents
    //debit note
    createDebitNote(
        policyId: string,
        debitNote: DebitNote,
        policy: Policy,
        count: number
    ) {
        console.log('create debit note method called');
        console.log(policyId);
        console.log('-------------------');
        console.log(debitNote);
        console.log('-------------------');
        console.log(policy);

        let insuranceType = '';
        const productType = policy.risks[0].insuranceType;
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        this.http
            .get<any>(
                `https://flosure-number-generation.herokuapp.com/aplus-invoice-number/1/0/${insuranceType}`
            )
            .subscribe(async res => {
                debitNote.debitNoteNumber = res.data.invoice_number;

             this.http
                    .post<DebitNote>(
                        `${BASE_URL}/documents/debit-note/${policyId}`,
                        debitNote
                    )
                    .subscribe(
                        async res => {
                            console.log(res);
                        },
                        async err => {
                            console.log(err);
                        }
                    );
            });
    }

    getDebitNotes(): Observable<DebitNote[]> {
        return this.http.get<DebitNote[]>(`${BASE_URL}/documents/debit-notes`);
    }

    getDebitNoteById(debitNoteId: string): Observable<DebitNote> {
        return this.http.get<DebitNote>(
            `${BASE_URL}/documents/debit-note/${debitNoteId}`
        );
    }

    updateDebitNote(
        debitNote: DebitNote,
        debitNoteId: string
    ): Observable<DebitNote> {
        return this.http.put<DebitNote>(
            `${BASE_URL}/documents/debit-note/${debitNoteId}`,
            debitNote
        );
    }

    //credit note
    createCreditNote(policyId: string, creditNote: CreditNote, policy: Policy) {
        console.log('create debit note method called');
        console.log(policyId);
        console.log('-------------------');
        console.log(creditNote);
        console.log('-------------------');
        console.log(policy);

        let insuranceType = '';
        const productType = policy.risks[0].insuranceType;
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        this.http
            .get<any>(
                `https://flosure-number-generation.herokuapp.com/aplus-invoice-number/1/0/${insuranceType}`
            )
            .subscribe(async res => {
                let tempCreditNoteNumber = res.data.invoice_number;
                creditNote.creditNoteNumber = tempCreditNoteNumber.replace(
                    'DR',
                    'CR'
                );

                this.http
                    .post<CreditNote>(
                        `${BASE_URL}/documents/credit-note/${policyId}`,
                        creditNote
                    )
                    .subscribe(
                        async res => {
                            console.log(res);
                        },
                        async err => {
                            console.log(err);
                        }
                    );
            });
    }

    getCreditNotes(): Observable<CreditNote[]> {
        return this.http.get<CreditNote[]>(
            `${BASE_URL}/documents/credit-notes`
        );
    }

    getCreditNoteById(creditNoteId: string): Observable<CreditNote> {
        return this.http.get<CreditNote>(
            `${BASE_URL}/documents/credit-note/${creditNoteId}`
        );
    }

    updateCreditNote(
        creditNote: CreditNote,
        creditNoteId: string
    ): Observable<CreditNote> {
        return this.http.put<CreditNote>(
            `${BASE_URL}/documents/credit-note/${creditNoteId}`,
            creditNote
        );
    }

    //cover note
    createCoverNote(
        policyId: string,
        coverNote: CoverNote
    ): Observable<CoverNote> {
        return this.http.post<CoverNote>(
            `${BASE_URL}/documents/cover-note/${policyId}`,
            coverNote
        );
    }

    getCoverNotes(): Observable<CoverNote> {
        return this.http.get<CoverNote>(`${BASE_URL}/documents/cover-notes`);
    }

    getCoverNoteById(coverNoteId: string): Observable<CoverNote> {
        return this.http.get<CoverNote>(
            `${BASE_URL}/documents/cover-note/${coverNoteId}`
        );
    }

    updateCoverNote(
        coverNote: CoverNote,
        coverNoteId: string
    ): Observable<CoverNote> {
        return this.http.put<CoverNote>(
            `${BASE_URL}/documents/cover-note/${coverNoteId}`,
            coverNote
        );
    }
}
