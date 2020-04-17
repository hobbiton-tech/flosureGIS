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

@Injectable({
    providedIn: 'root',
})
export class PaymentPlanService {
    private paymentPlansCollection: AngularFirestoreCollection<IPaymentModel>;
    paymentPlans: Observable<IPaymentModel[]>;
    paymentPlan: Observable<IPaymentModel>;

    constructor(private firebase: AngularFirestore) {
        this.paymentPlansCollection = firebase.collection<IPaymentModel>(
            'payments_plans'
        );
        this.paymentPlans = this.paymentPlansCollection.valueChanges();
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
}
