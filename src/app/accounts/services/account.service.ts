import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
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
import { ISelectedInsuranceType } from 'src/app/quotes/models/premium-computations.model';
import { IRequisitionModel } from '../components/models/requisition.model';

const BASE_URL = 'https://flosure-postgres-db.herokuapp.com';

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

    // behavioural subject to pass data between requisition component and payment requisition compnent
    // TODO: move to own service file
    voucherNumber = new BehaviorSubject<string>(null);
    payee = new BehaviorSubject<string>(null);
    requisitionAmount = new BehaviorSubject<number>(null);
    requisitionId = new BehaviorSubject<string>(null);
    requisitionCurrency = new BehaviorSubject<string>(null);

    // observable streams for behavioural subjects
    voucherNumberChanged$ = this.voucherNumber.asObservable();
    payeeChanged$ = this.payee.asObservable();
    requisitionAmountChanged = this.requisitionAmount.asObservable();
    requisitionIdChanged$ = this.requisitionId.asObservable();
    requisitionCurrencyChanged$ = this.requisitionCurrency.asObservable();

    // methods to change value of observables
    changeVoucherNumber(value: string) {
        this.voucherNumber.next(value);
    }

    changePayee(value: string) {
        this.payee.next(value);
    }

    changeRequisitionAmount(value: number) {
        this.requisitionAmount.next(value);
    }

    changeRequisitionId(value: string) {
        this.requisitionId.next(value);
    }

    changeRequisitionCurrency(value: string) {
        this.requisitionCurrency.next(value);
    }

    // add receipt
    async addReceipt(
        receipt: IReceiptModel,
        insuranceType: string
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
                .get<any>(
                    `https://number-generation.flosure-api.com/aplus-receipt-number/1`
                )
                .subscribe(async res => {
                    receipt.receiptNumber = res.data.receipt_number;
                    console.log(res.data.receipt_number);

                    await this.receiptCollection.doc(receipt.id).set(receipt);
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

    // Requisition
    createRequisition(
        requisition: IRequisitionModel
    ): Observable<IRequisitionModel> {
        return this.http.post<IRequisitionModel>(
            `${BASE_URL}/requisition/1`,
            requisition
        );
    }

    getRequisitions(): Observable<IRequisitionModel[]> {
        return this.http.get<IRequisitionModel[]>(`${BASE_URL}/requisition`);
    }

    getRequisitionById(requisitionId: string): Observable<IRequisitionModel> {
        return this.http.get<IRequisitionModel>(
            `${BASE_URL}/requisition/${requisitionId}`
        );
    }

    updateRequisition(
        requisitionId: string,
        requisition: IRequisitionModel
    ): Observable<IRequisitionModel> {
        return this.http.put<IRequisitionModel>(
            `${BASE_URL}/requisition/${requisitionId}`,
            requisition
        );
    }

    // temporary TO BE generated from api
    generateRequisitionID(totalRequisitions: number) {
        const count = this.countGenerator(totalRequisitions);
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);

        return 'REQ' + dateString + count;
    }
}
