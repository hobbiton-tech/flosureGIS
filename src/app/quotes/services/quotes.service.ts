import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel } from '../models/quote.model';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
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

    getRisks(): Observable<RiskModel[]> {
        return null;
    }

    generateQuoteNumber(brokerCode: string, totalQuotes: number) {}
}
