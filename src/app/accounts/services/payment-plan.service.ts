import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';

import * as _ from 'lodash';
import { v4 } from 'uuid';
import { PaymentPlan } from 'src/app/underwriting/models/policy.model';
import { first } from 'rxjs/operators';
import { IPaymentModel } from '../components/models/payment-plans.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
interface IReceiptNumberResult {
    receiptNumber: string;
}

@Injectable({
    providedIn: 'root',
})
export class PaymentPlanService {
    private paymentPlansCollection: AngularFirestoreCollection<IPaymentModel>;
    paymentPlans: Observable<IPaymentModel[]>;
    paymentPlan: Observable<IPaymentModel>;
    private receiptCollection: AngularFirestoreCollection<IReceiptModel>;
    receipts: Observable<IReceiptModel[]>;
    receipt: Observable<IReceiptModel>;
    receipted: IReceiptModel;
    url: string;

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService
    ) {
        this.paymentPlansCollection = firebase.collection<IPaymentModel>(
            'payments_plans'
        );
        this.paymentPlans = this.paymentPlansCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        this.receipts = this.receiptCollection.valueChanges();
    }

    async addPaymentPlan(paymentPlan: IPaymentModel) {
        this.paymentPlans.pipe(first()).subscribe(async (paymentPlans) => {
            await this.paymentPlansCollection
                .doc(paymentPlan.id)
                .set(paymentPlan)
                .then((mess) => {
                    console.log('------PAYMENT PLAN DATA-------');
                    console.log(paymentPlan);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    async updatePaymentPlan(paymentPlan: IPaymentModel): Promise<void> {
        return this.paymentPlansCollection
            .doc(`${paymentPlan.id}`)
            .update(paymentPlan)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPaymentPlans(): Observable<IPaymentModel[]> {
        return this.paymentPlans;
    }

    // add receipt
    async addReceipt(
        receipt: IReceiptModel,
        paymentPlan: IPaymentModel
    ): Promise<void> {
        this.receipts.pipe(first()).subscribe(async (receipts) => {
            // receipt.id = v4();
            await this.receiptCollection
                .doc(receipt.id)
                .set(receipt)
                .then((mess) => {
                    this.message.success('Receipt Successfully created');
                })
                .catch((err) => {
                    this.message.warning('Receipt Failed');
                    console.log(err);
                });

            await this.paymentPlansCollection
                .doc(`${paymentPlan.id}`)
                .update(paymentPlan)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }

    generateReceiptNumber(): Promise<any> {
        return this.http
            .get<any>('https://flosure-premium-rates.herokuapp.com/receipts')
            .toPromise();
    }
}
