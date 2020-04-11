import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
// import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { v4 } from 'uuid';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { IAmazonS3Result } from 'src/app/quotes/services/quotes.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { PoliciesComponent } from 'src/app/underwriting/components/policies/policies.component';
import { Policy } from 'src/app/underwriting/models/policy.model';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private policyCollection: AngularFirestoreCollection<Policy>;
    policies: Observable<Policy[]>;
    policyOb: Observable<Policy>;
    policy: Policy;

    private receiptCollection: AngularFirestoreCollection<IReceiptModel>;
    receipts: Observable<IReceiptModel[]>;
    receipt: Observable<IReceiptModel>;
    receipted: IReceiptModel;

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService
    ) {
        this.policyCollection = firebase.collection<Policy>('policies');

        this.policies = this.policyCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        this.receipts = this.receiptCollection.valueChanges();
    }

    // add receipt
    async addReceipt(receipt: IReceiptModel): Promise<void> {
        this.receipts.pipe(first()).subscribe(async (receipts) => {
            // receipt.id = v4();

            receipt.receiptNumber = this.generateReceiptNumber(
                'RR',
                receipts.length
            );

            await this.receiptCollection
                .doc(receipt.id)
                .set(receipt)
                .then((mess) => {
                    // view message
                    console.log('<========Receipt Details==========>');

                    console.log(receipt);
                })
                .catch((err) => {
                    console.log('<========Qoutation Error Details==========>');
                    console.log(err);
                });
        });
    }

    async updatePolicy(policy: Policy): Promise<void> {
        return this.policyCollection
            .doc(`${policy.id}`)
            .update(policy)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async updateReceipt(receipt: IReceiptModel): Promise<void> {
        console.log('==============Cancel Receipt Data=============');

        console.log(receipt);

        return this.receiptCollection
            .doc(`${receipt.id}`)
            .update(receipt)
            .then((res) => {
                this.message.warning('Receipt Cancelled');
                console.log('==========MESSAGE==========');
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getReciepts(): Observable<IReceiptModel[]> {
        return this.receipts;
    }

    getPolicies(): Observable<Policy[]> {
        return this.policies;
    }

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    // Genereating quote number
    generateReceiptNumber(brokerCode: string, totalReceipts: number) {
        const brokerCod = brokerCode;
        const today = new Date();
        const dateString: string =
            today.getFullYear().toString().substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);
        const count = this.countGenerator(totalReceipts);
        return 'RCPT' + brokerCode + dateString + count;
    }

    generateReceipt(dto: IReceiptDTO): Observable<IAmazonS3Result> {
        return this.http.post<IAmazonS3Result>(
            'https://flosure-pdf-service.herokuapp.com/reciept',
            dto
        );
    }
}
