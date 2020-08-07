import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { v4 } from 'uuid';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { IAmazonS3Result } from 'src/app/quotes/services/quotes.service';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { PoliciesComponent } from 'src/app/underwriting/components/policies/policies.component';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { InsuranceType } from '../../quotes/models/quote.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';

interface IReceiptNumberResult {
    receiptNumber: string;
}

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
    url: string;
    receiptN: any;

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService, private policeServices: PoliciesService, private router: Router
    ) {
        this.policyCollection = firebase.collection<Policy>('policies');

        this.policies = this.policyCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        // this.receipts = this.receiptCollection.valueChanges();
    }




    // add receipt
     addReceipt(
        receipt: IReceiptModel,
        insuranceType: InsuranceType
    ): Observable<any> {
        // this.receipts.pipe(first()).subscribe((receipts) => {
            // receipt.id = v4();

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

                   this.http.post('https://payment-api.savenda-flosure.com/receipt', receipt).subscribe((res: any) => {
                        console.log("RECEIPT RESULTS", res.data);
                        // if(res.status === 'true') {
                            this.message.success(
                                'Receipt Successfully created'
                            );
                            this.generateID(res.data.ID);
                        // }



                    },
                    (err) => {
                        console.log("RECEIPT ERR>>>", err);

                        this.message.warning('Receipt Failed');
                    });
                });

        // });
        return of(this.receiptN);
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

    updateReceipt(receipt: IReceiptModel):Observable<any> {

       return this.http.put(`https://payment-api.savenda-flosure.com/receipt/${receipt.ID}`, receipt);
    }

    getReciepts(): Observable<any> {
        return this.http.get<any>('https://payment-api.savenda-flosure.com/receipt');
    }

    getReciept(id): Observable<any> {
        return this.http.get<any>(`https://payment-api.savenda-flosure.com/receipt/${id}`);
    }

    getPolicies(): Observable<Policy[]> {
        return this.policies;
    }


    generateID(id) {
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
    }


}
