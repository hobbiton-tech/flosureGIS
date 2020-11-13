import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { InsuranceClassHandlerService } from './insurance-class-handler.service';

const BASE_URL = 'https://savenda.flosure-api.com';

// const BASE_URL = 'https://savenda.flosure-api.com';

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
export class PoliciesService implements OnDestroy {
    classHandlerSubscription: Subscription;
    currentClass: IClass;

    private policiesCollection: AngularFirestoreCollection<Policy>;
    policies: Observable<Policy[]>;
    policy: any;
    getDNote: any;

    constructor(
        private firebase: AngularFirestore,
        private msg: NzMessageService,
        private http: HttpClient,
        private accountsService: AccountService,
        private classHandler: InsuranceClassHandlerService
    ) {
        this.policiesCollection = firebase.collection<Policy>('policies');
        this.policies = this.policiesCollection.valueChanges();

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = currentClass;
            }
        );
    }

    // postgres db
    ///////////////////////
    createPolicy(policy: Policy): Observable<Policy> {
        let insuranceType = '';
        const productType = policy.risks[0].insuranceType;
        // tslint:disable-next-line: triple-equals
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        return this.http.post<Policy>(
            `${BASE_URL}/policy/${this.currentClass.id}`,
            policy
        );
    }

    // getPolicies(): Observable<Policy[]> {
    //     return this.http.get<Policy[]>('https://savenda.flosure-api.com/policy');

    // }

    // getPolicyById(policyId: string): Observable<Policy> {
    //     return this.http.get<Policy>(

    //         `https://savenda.flosure-api.com/policy/${policyId}`

    //     );
    //     return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    // }

    updatePolicy(policy: Policy): Observable<Policy> {
        return this.http.put<Policy>(
            `https://savenda.flosure-api.com/policy/${policy.id}`,
            policy
        );
    }

    // backup policies
    createBackupPolicy(policy: Policy): Observable<Policy> {
        return this.http.post<Policy>(
            'https://savenda.flosure-api.com/policy',
            policy
        );
    }

    getBackupPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>(`${BASE_URL}`);
    }

    getBackupPolicyById(policyId: string): Observable<Policy> {
        return this.http.get<Policy>(`${BASE_URL}/${policyId}`);

        // return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    }

    updateBackupPolicy(policy: Policy, policyId: string): Observable<Policy> {
        return this.http.put<Policy>(`${BASE_URL}/${policyId}`, policy);
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
            policy.id = v4();
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

            // this.http.put<Policy>(`${BASE_URL}/${policy.id}`, policy).subscribe(
            //     data => {
            //         this.msg.success('Policy Successfully Updated');
            //     },
            //     error => {
            //         this.msg.error('Failed');
            //     }
            // );

            this.http
                .post<Policy>(
                    `${BASE_URL}/policy/${this.currentClass.id}`,
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
        return this.http.get<Policy>(`${BASE_URL}/policy/${policyId}`);

        // return this.policiesCollection.doc<Policy>(policyId).valueChanges();
    }

    getClientsPolicies(clientId: string): Observable<Policy[]> {
        return this.policies.pipe(filter(policy => clientId === clientId));
    }

    getPolicies(): Observable<Policy[]> {
        return this.http.get<Policy[]>(`${BASE_URL}/policy`);

        // return this.policies;
    }

    // tslint:disable-next-line: variable-name
    countGenerator(number) {
        if (number <= 9999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    // Generating Policy Number
    generatePolicyNumber(brokerName: string, totalPolicies: number) {
        // tslint:disable-next-line: variable-name
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

    // tslint:disable-next-line: comment-format
    // documents
    // debit note
    createDebitNote(
        policyId: string,
        debitNote: DebitNote,
        policy: Policy,
        count: number
    ) {
        let insuranceType = '';
        const productType = policy.risks[0].insuranceType;
        // tslint:disable-next-line: triple-equals
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        this.http
            .get<any>(
                `https://number-generation.flosure-api.com/aplus-invoice-number/1/0/${insuranceType}`
            )
            .subscribe(async res => {
                debitNote.debitNoteNumber = res.data.invoice_number;

                this.http
                    .post<DebitNote>(
                        `${BASE_URL}/documents/debit-note/${policyId}`,
                        debitNote
                    )
                    .subscribe(
                        // tslint:disable-next-line: no-shadowed-variable
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

    // credit note
    createCreditNote(
        policyId: string,
        creditNote: CreditNote,
        policy: Policy,
        debitNoteNumber: string,
        requisition: IRequisitionModel
    ) {
        creditNote.creditNoteNumber = debitNoteNumber.replace('DR', 'CR');

        return this.http
            .post<CreditNote>(
                `${BASE_URL}/documents/credit-note/${policyId}`,
                creditNote
            );
            // .subscribe(
            //     // tslint:disable-next-line: no-shadowed-variable
            //     async res => {
            //         console.log('credit note', res);
            //         this.accountsService
            //             .createRequisition(requisition)
            //             .subscribe(res => console.log('requisition', res));
            //     },
            //     async err => {
            //         console.log(err);
            //     }
            // );
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

    // cover note
    createCoverNote(
        policyId: string,
        coverNote: CoverNote
    ): Observable<CoverNote> {
        return this.http.post<CoverNote>(
            `${BASE_URL}/documents/cover-note/${policyId}`,
            coverNote
        );
    }

    getCoverNotes(): Observable<CoverNote[]> {
        return this.http.get<CoverNote[]>(`${BASE_URL}/documents/cover-notes`);
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

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}
