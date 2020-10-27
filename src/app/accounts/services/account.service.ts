import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
// import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { InsuranceType } from '../../quotes/models/quote.model';
import { IRequisitionModel } from '../components/models/requisition.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';

const BASE_URL = 'https://savenda.flosure-api.com';

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
    receiptN: any;

    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private message: NzMessageService,
        // private policeServices: PoliciesService,
        private router: Router
    ) {
        this.policyCollection = firebase.collection<Policy>('policies');

        this.policies = this.policyCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        // this.receipts = this.receiptCollection.valueChanges();
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
    addReceipt(receipt: IReceiptModel, insuranceType: any): Observable<any> {
        // this.receipts.pipe(first()).subscribe((receipts) => {
        // receipt.id = v4();

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
            .subscribe(async res => {
                receipt.receipt_number = res.data.receipt_number;
                console.log(res.data.receipt_number);

                this.receiptN = receipt;

                this.http
                    .post(
                        'https://payment-api.savenda-flosure.com/receipt',
                        receipt
                    )
                    .subscribe(
                        (resa: any) => {
                            console.log('RECEIPT RESULTS', resa.data);
                            // if(res.status === 'true') {
                            this.message.success(
                                'Receipt Successfully created'
                            );
                            // this.generateID(res.data.ID);
                            // }
                        },
                        err => {
                            console.log('RECEIPT ERR>>>', err);

                            this.message.warning('Receipt Failed');
                        }
                    );
            });

        return of(this.receiptN);
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

    updateReceipt(receipt: IReceiptModel): Observable<any> {
        return this.http.put(
            `https://payment-api.savenda-flosure.com/receipt/${receipt.ID}`,
            receipt
        );
    }

    getReciepts(): Observable<any> {
        return this.http.get<any>(
            'https://payment-api.savenda-flosure.com/receipt'
        );
    }

    getReciept(id): Observable<any> {
        return this.http.get<any>(
            `https://payment-api.savenda-flosure.com/receipt/${id}`
        );
    }

    generateID(id) {
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
        // this.isConfirmLoading = true;
        // this.generateDocuments();
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

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    generateReqNumber() {
        return this.http.get(
            'https://number-generation.flosure-api.com/savenda-requisition-number'
        );
    }
}
