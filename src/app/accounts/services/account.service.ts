import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
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
import { InsuranceType } from 'src/app/settings/components/rates/models/rates.model';

interface IReceiptNumberResult {
    receiptNumber: string;
}

@Injectable({
    providedIn: 'root'
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
        private message: NzMessageService
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
    ): Promise<void> {
        this.receipts.pipe(first()).subscribe(async receipts => {
            // receipt.id = v4();

            let insuranceTyp = '';
            const productType = insuranceType;
            if (productType == 'Comprehensive') {
                insuranceTyp = 'MCP';
            } else {
                insuranceTyp = 'THP';
            }

            this.http
                .get<IReceiptNumberResult>(

                    'https://flosure-premium-rates.herokuapp.com/savenda-receipts/1'

                )
                .subscribe(async res => {
                    receipt.receiptNumber = res.receiptNumber;
                    console.log(res.receiptNumber);

                    await this.receiptCollection
                        .doc(receipt.id)
                        .set(receipt)
                        .then(mess => {
                            this.message.success(
                                'Receipt Successfully created'
                            );
                        })
                        .catch(err => {
                            this.message.warning('Receipt Failed');
                            console.log(err);
                        });
                });
        });
    }

    async updatePolicy(policy: Policy): Promise<void> {
        return this.policyCollection
            .doc(`${policy.id}`)
            .update(policy)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    async updateReceipt(receipt: IReceiptModel): Promise<void> {
        return this.receiptCollection
            .doc(`${receipt.id}`)
            .update(receipt)
            .then(res => {
                this.message.warning('Receipt Status Updateted');
            })
            .catch(err => {
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
            today
                .getFullYear()
                .toString()
                .substr(-2) +
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

    getPDF(uri: string): Observable<Blob> {
        return this.http.get(uri, { responseType: 'blob' });
    }

    printPDF(uri: string) {
        this.http
            .get(uri, { responseType: 'blob' as 'json' })
            .subscribe(res => {
                const myBlobPart: BlobPart = res as BlobPart;
                const file = new Blob([myBlobPart], {
                    type: 'your media type'
                });
                const fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                window.open(fileURL);
                this.url = fileURL;
            });
    }
}
