import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel, Quote } from '../models/quote.model';
import { Observable, from } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference
} from '@angular/fire/firestore';
import { map, flatMap, first } from 'rxjs/operators';
import { v4 } from 'uuid';
import { IQuoteDTO } from '../models/quote.dto';
import { IDebitNoteDTO } from '../models/debit-note.dto';
import { ICertificateDTO } from '../models/certificate.dto';
import { IReceiptDTO } from '../models/receipt.dto';
import { HttpClient } from '@angular/common/http';

export interface IQuoteDocument {
    clientID: string;
    receiptNumber: string;
    documentUrl: string;
}

export interface IAmazonS3Result {
    Etag: string;
    Location: string;
    key: string;
    Key: string;
    Bucket: string;
}

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
    quote: MotorQuotationModel;
    myQuote: DocumentReference;

    quoteDocumentsCollection: AngularFirestoreCollection<IQuoteDocument>;
    quoteDocuments: Observable<IQuoteDocument[]>;

    private riskCollection: AngularFirestoreCollection<RiskModel>;
    risks: Observable<RiskModel[]>;
    risk: Observable<RiskModel>;
    constructor(private firebase: AngularFirestore, private http: HttpClient) {
        this.motorQuoteCollection = firebase.collection<MotorQuotationModel>(
            'mortor_quotations'
        );

        this.quotations = this.motorQuoteCollection.valueChanges();

        this.riskCollection = firebase.collection<RiskModel>('risks');
        this.risks = this.riskCollection.valueChanges();

        this.quoteDocumentsCollection = firebase.collection<IQuoteDocument>(
            'quote-documents'
        );
        this.quoteDocuments = this.quoteDocumentsCollection.valueChanges();
    }

    // add quotation
    async addMotorQuotation(quotation: MotorQuotationModel): Promise<void> {
        this.quotations.pipe(first()).subscribe(async quotations => {
            quotation.id = v4();

            quotation.quoteNumber = this.generateQuoteNumber(
                'BRaa',
                quotations.length
            );

            await this.motorQuoteCollection
                .add(quotation)
                .then(mess => {
                    console.log(quotation);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    // add risks
    async addRisk(risk: RiskModel): Promise<void> {
        this.risks.pipe(first()).subscribe(async risks => {
            this.riskCollection
                .add(risk)
                .then(mess => {
                    console.log(risk);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    // get single risk
    getRisk(quoteNumber: string) {
        return this.firebase
            .collection('risks')
            .ref.where('quoteNumber', '==', quoteNumber)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                });
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
            });
    }

    getRisks(): Observable<RiskModel[]> {
        return this.risks;
    }

    getQuotes(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }

    private countGenerator(numb) {
        if (numb <= 99999) {
            numb = ('000' + numb).slice(-4);
        }
        return numb;
    }

    // Genereating quote number
    generateQuoteNumber(brokerCode: string, totalQuotes: number) {
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);
        const count = this.countGenerator(totalQuotes);
        return 'QO' + brokerCode + dateString + count;
    }

    // Get Quotes
    getQoute(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }

    generateQuote(dto: IQuoteDTO): Observable<IAmazonS3Result> {
        return this.http.post<IAmazonS3Result>(
            'https://flosure-pdf-service.herokuapp.com/quotation',
            dto
        );
    }

    generateDebitNote(dto: IDebitNoteDTO): Observable<IAmazonS3Result> {
        return this.http.post<IAmazonS3Result>(
            'https://flosure-pdf-service.herokuapp.com/debit-note',
            dto
        );
    }

    generateCertificate(dto: ICertificateDTO): Observable<IAmazonS3Result> {
        return this.http.post<IAmazonS3Result>(
            'https://flosure-pdf-service.herokuapp.com/certificate',
            dto
        );
    }

    generateReceipt(dto: IReceiptDTO): Observable<IAmazonS3Result> {
        return this.http.post<IAmazonS3Result>(
            'https://flosure-pdf-service.herokuapp.com/reciept',
            dto
        );
    }
}
