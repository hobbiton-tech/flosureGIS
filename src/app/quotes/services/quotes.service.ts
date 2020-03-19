import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel } from '../models/quote.model';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
    private quoteObject: AngularFirestoreDocument<MotorQuotationModel>;
    quotations: Observable<MotorQuotationModel[]>;
    quotation: Observable<MotorQuotationModel>;
    constructor(private firebase: AngularFirestore) {
        this.motorQuoteCollection = firebase.collection<MotorQuotationModel>(
            'mortor_quotations'
        );
    }

    addMotorQuotation(quotation: MotorQuotationModel): void {
        this.motorQuoteCollection
            .add(quotation)
            .then(mess => {
                // Do something
                console.log('<========Qoutation Details==========>');

                console.log(quotation);
            })
            .catch(err => {
                console.log('<========Qoutation Error Details==========>');
                console.log(err);
            });
    }

    addRisk(risk: RiskModel): void {}

    getMotorQuote(): Observable<MotorQuotationModel> {
        this.quoteObject = this.firebase.doc<MotorQuotationModel>(
            `mortor_quotations/Daniel`
        );
        // this.clientObject = this.firebase.collection<Client>('clients', ref => ref.where('clientID', '==', id));

        this.quotation = this.quoteObject.snapshotChanges().pipe(
            map(changes => {
                console.log('<========Data========>');
                console.log(changes);

                const data = changes.payload.data() as MotorQuotationModel;
                return data;
            })
        );

        return this.quotation;
    }

    getRisks(): Observable<RiskModel[]> {
        return null;
    }

    generateQuoteNumber(brokerCode: string, totalQuotes: number) {}
}
