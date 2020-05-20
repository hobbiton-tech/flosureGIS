import { Injectable } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    InsuranceType
} from '../models/quote.model';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { v4 } from 'uuid';
import { IQuoteDTO } from '../models/quote.dto';
import { IDebitNoteDTO } from '../models/debit-note.dto';
import { ICertificateDTO } from '../models/certificate.dto';
import { IReceiptDTO } from '../models/receipt.dto';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

export interface IQuoteDocument {
    id: string;
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

export interface IReceiptDocument {
    id: string;
    clientId: string;
    receiptNumber: string;
    receiptUrl: string;
}

interface IQuoteNumberRequest {
    // insuranceType: InsuranceType;
    branch: string;
}

interface IQuoteNumberResult {
    quoteNumber: string;
}

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
    quotations: Observable<MotorQuotationModel[]>;
    quotation: Observable<MotorQuotationModel>;
    quote: MotorQuotationModel;
    myQuote: DocumentReference;

    quoteDocumentsCollection: AngularFirestoreCollection<IQuoteDocument>;
    quoteDocuments: Observable<IQuoteDocument[]>;

    private riskCollection: AngularFirestoreCollection<RiskModel>;
    risks: Observable<RiskModel[]>;
    risk: Observable<RiskModel>;
    constructor(
        private firebase: AngularFirestore,
        private http: HttpClient,
        private msg: NzMessageService,
        private readonly router: Router
    ) {
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
        this.quotations.pipe(first()).subscribe(async () => {
            quotation.id = v4();
            this.http
                .get<IQuoteNumberResult>(
                    'https://flosure-premium-rates.herokuapp.com/savenda-quotations/01'
                )
                .subscribe(async res => {
                    quotation.quoteNumber = res.quoteNumber;
                    await this.motorQuoteCollection
                        .doc(quotation.id)
                        .set(quotation)
                        .then(() => {})
                        .catch(err => {
                            console.log(err);
                        });
                });
        });
    }

    async addQuoteDocuments(document: IQuoteDocument): Promise<void> {
        await this.quoteDocumentsCollection.doc(`${document.id}`).set(document);
    }
    // add risks
    async addRisk(risk: RiskModel): Promise<void> {
        this.risks.pipe(first()).subscribe(async () => {
            this.riskCollection
                .add(risk)
                .then(() => {
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

    // Genereating quote number
    generateQuoteNumber(): string {
        var quotationNumber: string = '';
        this.http
            .get<IQuoteNumberResult>(
                `https://flosure-premium-rates.herokuapp.com/savenda-quotations/01`
            )
            .subscribe(data => {
                quotationNumber = data.quoteNumber;
            });
        return quotationNumber;
    }

    // Genereating quote number
    // generateQuoteNumber(brokerCode: string, totalQuotes: number) {
    //     const today = new Date();
    //     const dateString: string =
    //         today.getFullYear().toString().substr(-2) +
    //         ('0' + (today.getMonth() + 1)).slice(-2) +
    //         +('0' + today.getDate()).slice(-2);
    //     const count = this.countGenerator(totalQuotes);
    //     return 'QO' + brokerCode + dateString + count;
    // }

    // Get Quotes
    getQoute(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }

    async updateQuote(quote: MotorQuotationModel): Promise<void> {
        return this.motorQuoteCollection
            .doc(`${quote.id}`)
            .update(quote)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
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

    //postgres db

    createMotorQuotation(motorQuotation: MotorQuotationModel) {
        let insuranceType = '';
        const productType = motorQuotation.risks[0].insuranceType;
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }

        this.http
            .get<IQuoteNumberResult>(
                `https://flosure-premium-rates.herokuapp.com/aplus-quote/1/0/${insuranceType}`
            )
            .subscribe(res => {
                motorQuotation.quoteNumber = res.quoteNumber;

                this.http
                    .post<MotorQuotationModel>(
                        'https://flosure-postgres-api.herokuapp.com/quotation',
                        motorQuotation
                    )
                    .subscribe(
                        async res => {
                            this.msg.success('Quotation Successfully Created');
                            this.router.navigateByUrl(
                                '/flosure/quotes/quotes-list'
                            );
                        },
                        async err => {
                            this.msg.error('Quotation Creation failed');
                        }
                    );
            });
    }

    getMotorQuotations(): Observable<MotorQuotationModel[]> {
        return this.http.get<MotorQuotationModel[]>(
            'https://flosure-postgres-api.herokuapp.com/quotation'
        );
    }

    getMotorQuotationById(
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.get<MotorQuotationModel>(
            `https://flosure-postgres-api.herokuapp.com/quotation/${quotationId}`
        );
    }

    updateMotorQuotation(
        motorQuotation: MotorQuotationModel,
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.put<MotorQuotationModel>(
            `https://flosure-postgres-api.herokuapp.com/quotation/${quotationId}`,
            motorQuotation
        );
    }
}
