import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { filter, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    // private recieptsCollection: AngularFirestoreCollection<MotorQuotationModel>;
    // reciepts: Observable<MotorQuotationModel[]>;
    // reciept: MotorQuotationModel;

    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
    quotations: Observable<MotorQuotationModel[]>;
    quotation: Observable<MotorQuotationModel>;
    quote: MotorQuotationModel;

    constructor(private firebase: AngularFirestore) {
        // this.recieptsCollection = firebase.collection<MotorQuotationModel>(
        //     'motor_quotations'
        // );
        // this.reciepts = this.recieptsCollection.valueChanges();

        this.motorQuoteCollection = firebase.collection<MotorQuotationModel>(
            'mortor_quotations'
        );

        this.quotations = this.motorQuoteCollection.valueChanges();
    }

    // getReciepts(): Observable<MotorQuotationModel[]> {
    //     return this.reciepts;
    // }

    getQuotes(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }
}
