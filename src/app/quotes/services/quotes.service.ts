import { Injectable, OnDestroy } from '@angular/core';
import { MotorQuotationModel, RiskModel } from '../models/quote.model';
import { Observable, Subscription } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { VehicleDetailsModel } from '../models/vehicle-details.model';
import { PropertyDetailsModel } from '../models/fire-class/property-details.model';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { CreateQuoteComponent } from '../components/create-quote/create-quote.component';
import { InsuranceClassService } from './insurance-class.service';
import { IAccidentRiskDetailsModel } from '../models/accident-class/accident-risk-details.model';
import { IMarineRiskDetailsModel } from '../models/marine-class/marine-risk-details.model';
import { IEngineeringRiskDetailsModel } from '../models/engineering-class/engineering-risk-details.model';

// const BASE_URL = 'http://104.248.247.78:3000';
// const BASE_URL = 'https://api.goldenlotusinsurance.com'
// const BASE_URL = 'https://api.goldenlotusinsurance.com';
const BASE_URL = 'https://api.goldenlotusinsurance.com';

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
export class QuotesService implements OnDestroy {
    classHandlerSubscription: Subscription;
    currentClass: IClass;

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
        private readonly router: Router,
        private classHandler: InsuranceClassHandlerService,
        private insuranceClassService: InsuranceClassService
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

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = currentClass;
            }
        );
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
    // postgres db
    createMotorQuotation(
        motorQuotation: MotorQuotationModel,
        vehicles: VehicleDetailsModel[],
        properties: PropertyDetailsModel[],
        accidentProducts: IAccidentRiskDetailsModel[],
        marineProducts: IMarineRiskDetailsModel[],
        engineeringProducts: IEngineeringRiskDetailsModel[]
    ) {
        const currentClassObj: IClass = JSON.parse(
            localStorage.getItem('classObject')
        );

        const quotationNumberRequest: IQuoteNumberRequest = {
            branch: motorQuotation.branch // get from db
        };
        this.http
            .get<any>(
                `https://number-generation.flosure-api.com/golden-lotus-quote-number`
            )
            .subscribe(
                async res => {
                    motorQuotation.quoteNumber = res.data.quotation_number;
                    console.log('WHAT THE >>>>', motorQuotation);
                    this.http
                        .post<MotorQuotationModel>(
                            `${BASE_URL}/quotation/${currentClassObj.id}`,
                            motorQuotation
                        )
                        .subscribe(
                            async resq => {
                                this.msg.success(
                                    'Quotation Successfully Created'
                                );
                                this.insuranceClassService.changeCreatingQuoteStatus(
                                    false
                                );
                                this.router.navigateByUrl(
                                    '/flosure/quotes/quotes-list'
                                );
                                this.addRiskDetails(
                                    vehicles,
                                    properties,
                                    accidentProducts,
                                    marineProducts,
                                    engineeringProducts
                                );
                            },
                            async err => {
                                this.msg.error('Quotation Creation failed');
                                this.insuranceClassService.changeCreatingQuoteStatus(
                                    false
                                );
                            }
                        );
                },
                async err => {
                    console.log(err);
                    // this.msg.error('Quotation Creation failed');
                }
            );
    }

    addRiskDetails(
        vehicles: VehicleDetailsModel[],
        properties: PropertyDetailsModel[],
        accidentProducts: IAccidentRiskDetailsModel[],
        marineProducts: IMarineRiskDetailsModel[],
        engineeringProducts: IEngineeringRiskDetailsModel[]
    ) {
        if (localStorage.getItem('class') == 'Fire') {
            properties.forEach(property => {
                this.addProperty(property.risk.id, property).subscribe(res =>
                    console.log(res)
                );
            });
        }

        if (localStorage.getItem('class') == 'Motor') {
            vehicles.forEach(vehicle => {
                this.addVehicle(vehicle.risk.id, vehicle).subscribe(res =>
                    console.log(res)
                );
            });
        }

        if (localStorage.getItem('class') == 'Accident') {
            accidentProducts.forEach(product => {
                this.addAccidentProduct(
                    product.risk.id,
                    product
                ).subscribe(res => console.log(res));
            });
        }

        if (localStorage.getItem('class') == 'Marine') {
            marineProducts.forEach(product => {
                this.addMarineProduct(product.risk.id, product).subscribe(res =>
                    console.log(res)
                );
            });
        }

        if (localStorage.getItem('class') == 'Engineering') {
            engineeringProducts.forEach(product => {
                this.addEngineeringProduct(
                    product.risk.id,
                    product
                ).subscribe(res => console.log(res));
            });
        }
    }

    postRtsa(params) {
        console.log('PARAMS>>>>>>>', params);
        this.http
            .post<any>(`https://rtsa-api.herokuapp.com/rtsa-savenda`, params)
            .subscribe(
                async res => {
                    console.log(res);
                },
                async err => {
                    console.log(err);
                }
            );
    }
    getMotorQuotations(): Observable<MotorQuotationModel[]> {
        return this.http.get<MotorQuotationModel[]>(`${BASE_URL}/quotation`);
    }
    getMotorQuotationById(
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.get<MotorQuotationModel>(
            `${BASE_URL}/quotation/${quotationId}`
        );
    }
    updateMotorQuotation(
        motorQuotation: MotorQuotationModel,
        quotationId: string
    ): Observable<MotorQuotationModel> {
        return this.http.put<MotorQuotationModel>(
            `${BASE_URL}/quotation/${quotationId}`,
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

    // Vehicle details (For Motor Insurance)
    addVehicle(
        riskId: string,
        vehicelDetails: VehicleDetailsModel
    ): Observable<VehicleDetailsModel> {
        return this.http.post<VehicleDetailsModel>(
            `${BASE_URL}/vehicle-details/${riskId}`,
            vehicelDetails
        );
    }

    getVehicles(): Observable<VehicleDetailsModel[]> {
        return this.http.get<VehicleDetailsModel[]>(
            `${BASE_URL}/vehicle-details`
        );
    }

    getOneVehicle(vehicleId: string): Observable<VehicleDetailsModel> {
        return this.http.get<VehicleDetailsModel>(
            `${BASE_URL}/vehicle-details/${vehicleId}`
        );
    }

    updateVehicle(
        vehicleDetails: VehicleDetailsModel,
        vehicleId: string
    ): Observable<VehicleDetailsModel> {
        return this.http.put<VehicleDetailsModel>(
            `${BASE_URL}/vehicle-details/${vehicleId}`,
            vehicleDetails
        );
    }

    // Property Details (For Fire insurance)
    addProperty(
        riskId: string,
        propertyDetails: PropertyDetailsModel
    ): Observable<PropertyDetailsModel> {
        return this.http.post<PropertyDetailsModel>(
            `${BASE_URL}/property-details/${riskId}`,
            propertyDetails
        );
    }

    getProperties(): Observable<PropertyDetailsModel[]> {
        return this.http.get<PropertyDetailsModel[]>(
            `${BASE_URL}/property-details`
        );
    }

    getOneProperty(propertyId: string): Observable<PropertyDetailsModel> {
        return this.http.get<PropertyDetailsModel>(
            `${BASE_URL}/propert-details/${propertyId}`
        );
    }

    updateProperty(
        propertyDetails: PropertyDetailsModel,
        propertyId: string
    ): Observable<PropertyDetailsModel> {
        return this.http.put<PropertyDetailsModel>(
            `${BASE_URL}/property-details/${propertyId}`,
            propertyDetails
        );
    }

    // accident product details (Accident class)
    addAccidentProduct(
        riskId: string,
        accidentProductDetails: IAccidentRiskDetailsModel
    ): Observable<IAccidentRiskDetailsModel> {
        return this.http.post<IAccidentRiskDetailsModel>(
            `${BASE_URL}/accident-product-details/${riskId}`,
            accidentProductDetails
        );
    }

    getAccidentProducts(): Observable<IAccidentRiskDetailsModel[]> {
        return this.http.get<IAccidentRiskDetailsModel[]>(
            `${BASE_URL}/accident-product-details`
        );
    }

    getOneAccidentProduct(
        accidentProductId: string
    ): Observable<IAccidentRiskDetailsModel> {
        return this.http.get<IAccidentRiskDetailsModel>(
            `${BASE_URL}/accident-product-details/${accidentProductId}`
        );
    }

    updateAccidentProduct(
        accidentProductDetails: IAccidentRiskDetailsModel,
        accidentProductId: string
    ): Observable<IAccidentRiskDetailsModel> {
        return this.http.put<IAccidentRiskDetailsModel>(
            `${BASE_URL}/accident-product-details/${accidentProductId}`,
            accidentProductDetails
        );
    }

    // marine product details (Marine class)
    addMarineProduct(
        riskId: string,
        marineProductDetails: IMarineRiskDetailsModel
    ): Observable<IMarineRiskDetailsModel> {
        return this.http.post<IMarineRiskDetailsModel>(
            `${BASE_URL}/marine-product-details/${riskId}`,
            marineProductDetails
        );
    }

    getMarineProducts(): Observable<IMarineRiskDetailsModel[]> {
        return this.http.get<IMarineRiskDetailsModel[]>(
            `${BASE_URL}/marine-product-details`
        );
    }

    getOneMarineProduct(
        marineProductId: string
    ): Observable<IMarineRiskDetailsModel> {
        return this.http.get<IMarineRiskDetailsModel>(
            `${BASE_URL}/marine-product-details/${marineProductId}`
        );
    }

    updateMarineProduct(
        marineProductDetails: IMarineRiskDetailsModel,
        marineProductId: string
    ): Observable<IMarineRiskDetailsModel> {
        return this.http.put<IMarineRiskDetailsModel>(
            `${BASE_URL}/marine-product-details/${marineProductId}`,
            marineProductDetails
        );
    }

    // engineering product details (Marine class)
    addEngineeringProduct(
        riskId: string,
        engineeringProductDetails: IEngineeringRiskDetailsModel
    ): Observable<IEngineeringRiskDetailsModel> {
        return this.http.post<IEngineeringRiskDetailsModel>(
            `${BASE_URL}/engineering-product-details/${riskId}`,
            engineeringProductDetails
        );
    }

    getEngineeringProducts(): Observable<IEngineeringRiskDetailsModel[]> {
        return this.http.get<IEngineeringRiskDetailsModel[]>(
            `${BASE_URL}/engineering-product-details`
        );
    }

    getOneEngineeringProduct(
        engineeringProductId: string
    ): Observable<IEngineeringRiskDetailsModel> {
        return this.http.get<IEngineeringRiskDetailsModel>(
            `${BASE_URL}/engineering-product-details/${engineeringProductId}`
        );
    }

    updateEngineeringProduct(
        engineeringProductDetails: IEngineeringRiskDetailsModel,
        engineeringProductId: string
    ): Observable<IEngineeringRiskDetailsModel> {
        return this.http.put<IEngineeringRiskDetailsModel>(
            `${BASE_URL}/engineering-product-details/${engineeringProductId}`,
            engineeringProductDetails
        );
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
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
//
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
