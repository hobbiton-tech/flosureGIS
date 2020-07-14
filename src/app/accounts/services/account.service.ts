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

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService, private policeServices: PoliciesService, private router: Router
    ) {
        this.policyCollection = firebase.collection<Policy>('policies');

        this.policies = this.policyCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        this.receipts = this.receiptCollection.valueChanges();
    }




    // add receipt
    async addReceipt(
        receipt: IReceiptModel,
        insuranceType: InsuranceType
    ) {
        this.receipts.pipe(first()).subscribe(async (receipts) => {
            // receipt.id = v4();

            let insuranceType = '';
            const productType = insuranceType;
            if (productType == 'Comprehensive') {
                insuranceType = '07001';
            } else {
                insuranceType = '07002';
            }

            this.http
                .get<any>(
                    `https://flosure-number-generation.herokuapp.com/savenda-receipt-number/1`
                )
                .subscribe(async (res) => {
                    receipt.receipt_number = res.data.receipt_number;
                    console.log(res.data.receipt_number);

                    await this.http.post('http://localhost:8022/receipt', receipt).subscribe((res: any) => {
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

                    // await this.receiptCollection.doc(receipt.ID).set(receipt);
                    // .then((mess) => {
                    //     this.message.success(
                    //         'Receipt Successfully created'
                    //     );
                    // })
                    // .catch((err) => {
                    //     this.message.warning('Receipt Failed');
                    //     console.log(err);
                    // });
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

    async updateReceipt(receipt: IReceiptModel) {

        this.http.put(`http://localhost:8022/receipt/${receipt.ID}`, receipt).subscribe((res) => {
            this.message.success(
                        'Receipt Successfully Updated'
                    );
        }, 
        (err) => {
            console.log('Check ERR>>>>',err);
            
            this.message.warning('Receipt Failed');
        });
    }

    getReciepts(): Observable<any> {
        return this.http.get<any>('http://localhost:8022/receipt');
    }

    getReciept(id): Observable<any> {
        return this.http.get<any>(`http://localhost:8022/receipt/${id}`);
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
