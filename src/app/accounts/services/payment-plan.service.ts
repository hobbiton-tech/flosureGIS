import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';

import * as _ from 'lodash';
import { v4 } from 'uuid';
import { PaymentPlan } from 'src/app/underwriting/models/policy.model';
import { first } from 'rxjs/operators';
import { IPaymentModel } from '../components/models/payment-plans.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, Resolve } from '@angular/router';

interface IReceiptNumberResult {
    receiptNumber: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentPlanService implements Resolve<any> {
    private paymentPlansCollection: AngularFirestoreCollection<IPaymentModel>;
    paymentPlans: Observable<IPaymentModel[]>;
    paymentPlan: Observable<IPaymentModel>;
    private receiptCollection: AngularFirestoreCollection<IReceiptModel>;
    receipts: Observable<IReceiptModel[]>;
    receipt: Observable<IReceiptModel>;
    receipted: IReceiptModel;
    url: string;
    rcptNumber: any;
    _id: any;

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService,
        private router: Router
    ) {
        this.paymentPlansCollection = firebase.collection<IPaymentModel>(
            'payments_plans'
        );
        this.paymentPlans = this.paymentPlansCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        this.receipts = this.receiptCollection.valueChanges();
    }
    resolve(
        route: import('@angular/router').ActivatedRouteSnapshot,
        state: import('@angular/router').RouterStateSnapshot
    ) {
        throw new Error('Method not implemented.');
    }

    async addPaymentPlan(paymentPlan: IPaymentModel) {
        this.paymentPlans.pipe(first()).subscribe(async paymentPlans => {
            await this.paymentPlansCollection
                .doc(paymentPlan.id)
                .set(paymentPlan)
                .then(mess => {
                    console.log('------PAYMENT PLAN DATA-------');
                    console.log(paymentPlan);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    async updatePaymentPlan(paymentPlan: IPaymentModel): Promise<void> {
        return this.paymentPlansCollection
            .doc(`${paymentPlan.id}`)
            .update(paymentPlan)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getPaymentPlans(): Observable<IPaymentModel[]> {
        return this.paymentPlans;
    }

    async addPaymentPlanReceipt(
        receipt: IReceiptModel,
        paymentPlan: IPaymentModel
    ): Promise<void> {
        this.receipts.pipe(first()).subscribe(async receipts => {
            this.http
                .get<IReceiptNumberResult>(
                    'https://number-generation.flosure-api.com/aplus-receipt-number/1'
                )
                .subscribe(async res => {
                    receipt.receiptNumber = res.receiptNumber;
                    console.log('/////////////////////');

                    console.log(res.receiptNumber);
                    // paymentPlan.planReceipt[0].receiptNumber =
                    //     res.receiptNumber;

                    this.rcptNumber = paymentPlan.planReceipt.filter(
                        rcpt => rcpt.id === receipt.id
                    )[0];

                    this.rcptNumber.receiptNumber = res.receiptNumber;

                    await this.receiptCollection
                        .doc(receipt.id)
                        .set(receipt)
                        .then(async mess => {
                            await this.paymentPlansCollection
                                .doc(paymentPlan.id)
                                .set(paymentPlan)
                                .then(mes => {
                                    console.log(
                                        '------PAYMENT PLAN DATA-------'
                                    );
                                    console.log(paymentPlan);
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            this.generateID(receipt.id);
                            this.message.success(
                                'Receipt Successfully created'
                            );
                        })
                        .catch(err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });

            // receipt.id = v4();
        });
    }

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    // add receipt
    async addReceipt(
        receipt: IReceiptModel,
        paymentPlan: IPaymentModel
    ): Promise<void> {
        this.receipts.pipe(first()).subscribe(async receipts => {
            this.http
                .get<IReceiptNumberResult>(
                    'https://number-generation.flosure-api.com/aplus-receipt-number/1'
                )
                .subscribe(async res => {
                    receipt.receiptNumber = res.receiptNumber;
                    console.log(res.receiptNumber);
                    // paymentPlan.planReceipt[0].receiptNumber =
                    //     res.receiptNumber;

                    this.rcptNumber = paymentPlan.planReceipt.filter(
                        rcpt => rcpt.id === receipt.id
                    )[0];

                    this.rcptNumber.receiptNumber = res.receiptNumber;

                    await this.receiptCollection
                        .doc(receipt.id)
                        .set(receipt)
                        .then(async mess => {
                            this.message.success(
                                'Receipt Successfully created'
                            );

                            await this.paymentPlansCollection
                                .doc(`${paymentPlan.id}`)
                                .update(paymentPlan)
                                .then(result => {
                                    console.log(result);
                                })
                                .catch(err => {
                                    console.log(err);
                                });

                            this.generateID(receipt.id);
                        })
                        .catch(err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });

            // receipt.id = v4();
        });
    }

    generateReceiptNumber(): Promise<any> {
        return this.http
            .get<any>(
                'https://number-generation.flosure-api.com/aplus-receipt-number/1'
            )
            .toPromise();
    }
}
