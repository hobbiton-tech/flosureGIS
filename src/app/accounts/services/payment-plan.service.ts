import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
} from '@angular/fire/firestore';

import * as _ from 'lodash';
import { v4 } from 'uuid';
import { PaymentPlan, InsuranceType } from 'src/app/underwriting/models/policy.model';
import { first } from 'rxjs/operators';
import { IPaymentModel, InstallmentsModel, PlanReceipt, PlanPolicy } from '../components/models/payment-plans.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

interface IReceiptNumberResult {
    receiptNumber: string;
}

@Injectable({
    providedIn: 'root',
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
    baseInstallmentUrl: 'https://payment-api.savenda-flosure.com/payment-plan/installment'
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
        throw new Error("Method not implemented.");
    }
    
   

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }

    addReceipt(receipt: IReceiptModel, insuranceType: InsuranceType): Observable<any> {
        let insuranceTyp= '';
            const productType = insuranceType;
            if (productType == 'Comprehensive') {
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

                    this.receiptN = receipt

                   this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).toPromise()
                });
                
        // });
        return of(this.receiptN);
    }

    
    

    generateReceiptNumber(): Promise<any> {
        return this.http
            .get<any>(
                'https://flosure-rates-api.herokuapp.com/savenda-receipts/1'
            )
            .toPromise();
    }



    createPaymentPlan(
        paymentPlan: IPaymentModel
    ): Observable<any> {
        return this.http.post<IPaymentModel>('https://payment-api.savenda-flosure.com/payment-plan',paymentPlan);
    }

    getPaymentPlan(): Observable<any> {
        return this.http.get<any>('https://payment-api.savenda-flosure.com/payment-plan');
    }

    

    getInstallments(): Observable<any>{
        return this.http
            .get<any>(
                'https://payment-api.savenda-flosure.com/payment-plan/installment'
            )
    }


    addPlanReceipt( planReceipt: PlanReceipt): Observable<any> {
        return this.http.post<PlanReceipt>('https://payment-api.savenda-flosure.com/plan-receipt',planReceipt);
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
            console.log('Check ERR>>>>',err);
            
            this.message.warning('Plan Receipt Failed');
        });
    }


    addPlanPolicy( policyPaymentPlan: PlanPolicy): Observable<PlanPolicy> {
        return this.http.post<PlanPolicy>('https://payment-api.savenda-flosure.com/plan-policy',policyPaymentPlan);
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
            console.log('Check ERR>>>>',err);
            
            this.message.warning('Plan Policy Failed');
        });
    }


    updatePlanInstallment(policyPaymentInstallment: InstallmentsModel[]) {
        
        let header = new HttpHeaders();
        header.set('Access-Control-Allow-Origin', '*');

        this.http.put(`https://payment-api.savenda-flosure.com/payment-plan/installment`, policyPaymentInstallment, { headers: header }).subscribe((res) => {
            // this.message.success(
            //             'Plan Receipt Successfully Updated'
            //         );
        }, 
        (err) => {
            console.log('Check ERR>>>>',err);
            
            this.message.warning('Plan Policy Failed');
        });
    }
    
}
