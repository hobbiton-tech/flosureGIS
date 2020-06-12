import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel } from '../models/quote.model';
import { Observable } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference,
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
const BASE_URL = 'https://flosure-api.azurewebsites.net';
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
    providedIn: 'root',
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
            'motor_quotations'
        );
        this.quotations = this.motorQuoteCollection.valueChanges();
        this.riskCollection = firebase.collection<RiskModel>('risks');
        this.risks = this.riskCollection.valueChanges();
        this.quoteDocumentsCollection = firebase.collection<IQuoteDocument>(
            'quote-documents'
        );
        this.quoteDocuments = this.quoteDocumentsCollection.valueChanges();
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
                .catch((err) => {
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
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                });
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });
    }
    getRisks(): Observable<RiskModel[]> {
        return this.risks;
    }
    getQuotes(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }
    // Get Quotes
    getQoute(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }
    async updateQuote(quote: MotorQuotationModel): Promise<void> {
        return this.motorQuoteCollection
            .doc(`${quote.id}`)
            .update(quote)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    //postgres db
    createMotorQuotation(motorQuotation: MotorQuotationModel, count) {
        let insuranceType = '';
        const productType = motorQuotation.risks[0].insuranceType;
        if (productType == 'Comprehensive') {
            insuranceType = 'MCP';
        } else {
            insuranceType = 'THP';
        }
        const quotationNumberRequest: IQuoteNumberRequest = {
            branch: motorQuotation.branch, //get from db
        };
        this.http
            .get<any>(
                `https://flosure-number-generation.herokuapp.com/aplus-quote-number/1/0/${insuranceType}`
            )
            .subscribe(async (res) => {
                motorQuotation.quoteNumber = res.data.quotation_number;
                console.log('WHAT THE >>>>', res);
                this.http
                    .post<MotorQuotationModel>(
                        'https://www.flosure-api.com/quotation',
                        motorQuotation
                    )
                    .subscribe(
                        async (res) => {
                            this.msg.success('Quotation Successfully Created');
                            this.router.navigateByUrl(
                                '/flosure/quotes/quotes-list'
                            );
                        },
                        async (err) => {
                            this.msg.error('Quotation Creation failed');
                        }
                    );
            });
    }

    postRtsa(params) {
        console.log('PARAMS>>>>>>>', params);
        this.http
            .post<any>(`https://rtsa-api.herokuapp.com/rtsa`, params)
            .subscribe(
                async (res) => {
                    console.log(res);
                },
                async (err) => {
                    console.log(err);
                }
            );
    }
    getMotorQuotations(): Observable<MotorQuotationModel[]> {
        return this.http.get<MotorQuotationModel[]>(
            'https://www.flosure-api.com/quotation'
        );
    }
    getMotorQuotationById(
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.get<MotorQuotationModel>(
            `https://www.flosure-api.com/quotation/${quotationId}`
        );
    }
    updateMotorQuotation(
        motorQuotation: MotorQuotationModel,
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.put<MotorQuotationModel>(
            `https://www.flosure-api.com/quotation/${quotationId}`,
            motorQuotation
        );
    }
    /// POSTGES DB METHODS
    public addPolicyPG(dto: AddPolicyDTO): Observable<PolicyModelPG> {
        return this.http.post<PolicyModelPG>(`${BASE_URL}/policies/add`, dto);
    }
    public addRiskPG(dto: AddRiskDTO): Observable<RiskModelPG> {
        return this.http.post<RiskModelPG>(
            `${BASE_URL}/policies/risks/add`,
            dto
        );
    }
    public addLoadingPG(dto: LoadingDTO): Observable<RiskModelPG> {
        return this.http.post<RiskModelPG>(
            `${BASE_URL}/policies/loading/add`,
            dto
        );
    }
    public addDiscountPG(dto: DiscountDTO): Observable<RiskModelPG> {
        return this.http.post<RiskModelPG>(
            `${BASE_URL}/policies/discount/add`,
            dto
        );
    }
}
export class PolicyModelPG {
    clientId: string;
    dateCreated: Date;
    dateOfIssue: Date;
    dateUpdated: Date;
    endDate: Date;
    id: string;
    intermediaryId: string;
    policyNumber: string;
    startDate: Date;
    timeOfIssue: Date;
}
export class RiskModelPG {
    endDate: Date;
    id: string;
    insuranceType: InsuranceType;
    policyid: string;
    productType: ProductType;
    startDate: Date;
    sumInsured: number;
}
export class LoadingModelPG {
    id: number;
    riskId: string;
    amount: number;
    loadingType:
        | 'Car_Stereo'
        | 'Increased_Third_Party_Limit'
        | 'Inexperienced_Driver'
        | 'Loss_Of_Use'
        | 'Riot_And_Strike'
        | 'Territorial_Extension'
        | 'Under_Age_Driver';
}
export class DiscountModelPG {
    id: string;
    riskid: string;
    amount: number;
    discountType: 'LowTermAgreement' | 'Loyalty' | 'NoClaims' | 'ValuedClient';
}
export type ProductType = 'Private' | 'Commercial' | 'BusTaxi';
export type InsuranceType = 'ThirdParty' | 'Comprehensive';
export type LoadType =
    | 'Increased Third Party Limit'
    | 'Riot And Strike'
    | 'Car Stereo'
    | 'Territorial Extension'
    | 'Loss Of Use'
    | 'Inexperienced Driver'
    | 'Under Age Driver';
export type DiscountType =
    | 'No Claims Discount'
    | 'Loyalty Discount'
    | 'Valued Client Discount'
    | 'Low Term Agreement Discount';
export interface AddPolicyDTO {
    clientId: string;
    intermediaryId: string;
    startDate: Date;
    endDate: Date;
}
export interface AddRiskDTO {
    policyId: string;
    sumInsured: number;
    startDate: Date;
    endDate: Date;
    basicPremium: number;
    premiumLevy: number;
    productType: ProductType;
    insuranceType: InsuranceType;
    vehicle: VehicleDTO;
    premium: PremiumDTO;
    loading?: LoadingDTO;
    discount?: DiscountDTO;
}
export interface VehicleDTO {
    regNumber: string;
    vehicleMake: string;
    vehicleModel: string;
    yearOfManufacture: string;
    engineNumber?: string;
    chassisNumber?: string;
    estimatedValue?: number;
    color: string;
}
export interface PremiumDTO {
    basicPremium: number;
    premiumLevy: number;
    netPremium: number;
    premiumRate: number;
}
export interface LoadingDTO {
    loadingType: LoadType;
    amount: number;
}
export interface DiscountDTO {
    discountType: DiscountType;
    amount: number;
}
