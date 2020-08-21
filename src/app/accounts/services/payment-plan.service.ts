import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';

import * as _ from 'lodash';
import { v4 } from 'uuid';
import { PaymentPlan, InsuranceType } from 'src/app/underwriting/models/policy.model';
import { first } from 'rxjs/operators';
import { IPaymentModel, InstallmentsModel, PlanReceipt, PlanPolicy } from '../components/models/payment-plans.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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

    basePaymentPlanUrl: 'https://payment-api.savenda-flosure.com/payment-plan';
    baseInstallmentUrl: 'https://payment-api.savenda-flosure.com/payment-plan/installment';
    receiptN: IReceiptModel;

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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        throw new Error('Method not implemented.');
    }

<<<<<<< HEAD
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
=======

>>>>>>> changa-test

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

<<<<<<< HEAD
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
=======
    addReceipt(receipt: IReceiptModel, insuranceType: InsuranceType): Observable<any> {
        let insuranceTyp = '';
        const productType = insuranceType;
        if (productType === 'Comprehensive') {
                insuranceTyp = '07001';
            } else {
                insuranceTyp = '07002';
            }

        this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/savenda-receipt-number/1`
                )
                .subscribe(async (res) => {
                    receipt.receipt_number = res.data.receipt_number;
                    console.log(res.data.receipt_number);

                    this.receiptN = receipt;

                    this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).toPromise();
>>>>>>> changa-test
                });

        // });
        return of(this.receiptN);
    }





    createPaymentPlan(
        paymentPlan: IPaymentModel
    ): Observable<any> {
        return this.http.post<IPaymentModel>('https://payment-api.savenda-flosure.com/payment-plan', paymentPlan);
    }


  updatePaymentPlan(policyPaymentPlan: PlanPolicy) {

    return this.http.put(`https://payment-api.savenda-flosure.com/payment-plan/${policyPaymentPlan.ID}`, policyPaymentPlan);

  }

    getPaymentPlan(): Observable<any> {
        return this.http.get<any>('https://payment-api.savenda-flosure.com/payment-plan');
    }



    getInstallments(): Observable<any> {
        return this.http
            .get<any>(
<<<<<<< HEAD
                'https://number-generation.flosure-api.com/aplus-receipt-number/1'
            )
            .toPromise();
=======
                'https://payment-api.savenda-flosure.com/installment'
            );
    }


    addPlanReceipt( planReceipt: PlanReceipt): Observable<any> {
        return this.http.post<PlanReceipt>('https://payment-api.savenda-flosure.com/plan-receipt', planReceipt);
>>>>>>> changa-test
    }

    getReceiptPlan(): Observable<any> {
        return this.http.get<any>('https://payment-api.savenda-flosure.com/plan-receipt');
    }


    updatePlanReceipt(planReceipt: PlanReceipt) {

        this.http.put(`https://payment-api.savenda-flosure.com/plan-receipt/${planReceipt.ID}`, planReceipt).subscribe((res) => {
            this.message.success(
                        'Plan Receipt Successfully Updated'
                    );
        },
        (err) => {
            console.log('Check ERR>>>>', err);

            this.message.warning('Plan Receipt Failed');
        });
    }


    addPlanPolicy( policyPaymentPlan: PlanPolicy): Observable<PlanPolicy> {
        return this.http.post<PlanPolicy>('https://payment-api.savenda-flosure.com/plan-policy', policyPaymentPlan);
    }

    getPlanPolicy(): Observable<any> {
        return this.http.get<any>('https://payment-api.savenda-flosure.com/plan-policy');
    }


    updatePlanPolicy(policyPaymentPlan: PlanPolicy) {

        this.http.put(`https://payment-api.savenda-flosure.com/plan-policy/${policyPaymentPlan.ID}`, policyPaymentPlan).subscribe((res) => {
            this.message.success(
                        'Plan Receipt Successfully Updated'
                    );
        },
        (err) => {
            console.log('Check ERR>>>>', err);

            this.message.warning('Plan Policy Failed');
        });

    }


    updatePlanInstallment(policyPaymentInstallment: InstallmentsModel[]) {

        const header = new HttpHeaders();
        header.set('Access-Control-Allow-Origin', '*');

        this.http.put(`https://payment-api.savenda-flosure.com/installment`, policyPaymentInstallment, { headers: header }).subscribe((res) => {
            // this.message.success(
            //             'Plan Receipt Successfully Updated'
            //         );
        },
        (err) => {
            console.log('Check ERR>>>>', err);

            this.message.warning('Plan Policy Failed');
        });
    }

}
