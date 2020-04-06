import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from '../components/models/receipts.model';
import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
    quotations: Observable<MotorQuotationModel[]>;
    quotation: Observable<MotorQuotationModel>;
    quote: MotorQuotationModel;

    private receiptCollection: AngularFirestoreCollection<IReceiptModel>;
    receipts: Observable<IReceiptModel[]>;
    receipt: Observable<IReceiptModel>;
    receipted: IReceiptModel;

    constructor(private firebase: AngularFirestore) {
        this.motorQuoteCollection = firebase.collection<MotorQuotationModel>(
            'mortor_quotations'
        );

        this.quotations = this.motorQuoteCollection.valueChanges();

        this.receiptCollection = firebase.collection<IReceiptModel>('receipts');

        this.receipts = this.receiptCollection.valueChanges();
    }

    // add receipt
    async addReceipt(receipt: IReceiptModel): Promise<void> {
        this.receipts.pipe(first()).subscribe(async receipts => {
            // receipt.id = v4();

            receipt.receiptNumber = this.generateReceiptNumber(
                'RR',
                receipts.length
            );

            await this.receiptCollection
                .add(receipt)
                .then(mess => {
                    // view message
                    console.log('<========Receipt Details==========>');

                    console.log(receipt);
                })
                .catch(err => {
                    console.log('<========Qoutation Error Details==========>');
                    console.log(err);
                });
        });
    }

    getReciepts(): Observable<IReceiptModel[]> {
        return this.receipts;
    }

    getQuotes(): Observable<MotorQuotationModel[]> {
        return this.quotations;
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
}
