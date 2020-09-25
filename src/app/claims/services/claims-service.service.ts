import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { Claim } from '../models/claim.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IClaimant } from '../models/claimant.model';
import { IServiceProvider } from '../models/service-provider.model';
import { IServiceProviderQuote } from '../models/service-provider-quote.model';
import { IDocumentUpload } from '../models/document-upload.model';
import { IPhotoUpload } from '../models/photo-upload.model';
import { ILossQuantum } from '../models/loss-quantum.model';
import { IInsuranceCompany } from '../models/insurance-company.model';

const BASE_URL = 'https://flosure-postgres-db.herokuapp.com';

@Injectable({
    providedIn: 'root'
})
export class ClaimsService {
    constructor(private http: HttpClient) {}

    // claim
    createClaim(claim: Claim): Observable<Claim> {
        return this.http.post<Claim>(`${BASE_URL}/claim/1`, claim);
    }

    getClaims(): Observable<Claim[]> {
        return this.http.get<Claim[]>(`${BASE_URL}/claim`);
    }

    getClaimById(claimId: string): Observable<Claim> {
        return this.http.get<Claim>(`${BASE_URL}/claim/${claimId}`);
    }

    updateClaim(claimId: string, claim: Claim): Observable<Claim> {
        return this.http.put<Claim>(`${BASE_URL}/claim/${claimId}`, claim);
    }

    // claimant
    createClaimant(claimant: IClaimant): Observable<IClaimant> {
        return this.http.post<IClaimant>(`${BASE_URL}/claimant/1`, claimant);
    }

    getClaimants(): Observable<IClaimant[]> {
        return this.http.get<IClaimant[]>(`${BASE_URL}/claimant`);
    }

    getClaimantById(claimantId: string): Observable<IClaimant> {
        return this.http.get<IClaimant>(`${BASE_URL}/claimant/${claimantId}`);
    }

    updateClaimant(
        claimantId: string,
        claimant: IClaimant
    ): Observable<IClaimant> {
        return this.http.put<IClaimant>(
            `${BASE_URL}/claimant/${claimantId}`,
            claimant
        );
    }

    // service provider
    createServiceProvider(
        serviceProvider: IServiceProvider
    ): Observable<IServiceProvider> {
        return this.http.post<IServiceProvider>(
            `${BASE_URL}/service-provider/1`,
            serviceProvider
        );
    }

    getServiceProviders(): Observable<IServiceProvider[]> {
        return this.http.get<IServiceProvider[]>(
            `${BASE_URL}/service-provider`
        );
    }

    getServiceProviderById(
        serviceProviderId: string
    ): Observable<IServiceProvider> {
        return this.http.get<IServiceProvider>(
            `${BASE_URL}/service-provider/${serviceProviderId}`
        );
    }

    updateServiceProvider(
        serviceProviderId: string,
        serviceProvider: IServiceProvider
    ): Observable<IServiceProvider> {
        return this.http.put<IServiceProvider>(
            `${BASE_URL}/service-provider/${serviceProviderId}`,
            serviceProvider
        );
    }

    // service provider quotations
    createServiceProviderQuote(
        serviceProviderQuote: IServiceProviderQuote
    ): Observable<IServiceProviderQuote> {
        return this.http.post<IServiceProviderQuote>(
            `${BASE_URL}/service-provider-quotations/1`,
            serviceProviderQuote
        );
    }

    getServiceProvidersQuotes(): Observable<IServiceProviderQuote[]> {
        return this.http.get<IServiceProviderQuote[]>(
            `${BASE_URL}/service-provider-quotations`
        );
    }

    getServiceProviderQuoteById(
        serviceProviderQuoteId: string
    ): Observable<IServiceProviderQuote> {
        return this.http.get<IServiceProviderQuote>(
            `${BASE_URL}/service-provider-quotations/${serviceProviderQuoteId}`
        );
    }

    updateServiceProviderQuote(
        serviceProviderQuoteId: string,
        serviceProviderQuote: IServiceProviderQuote
    ): Observable<IServiceProviderQuote> {
        return this.http.put<IServiceProviderQuote>(
            `${BASE_URL}/service-provider-quotations/${serviceProviderQuoteId}`,
            serviceProviderQuote
        );
    }

    // document uploads
    createDocumentUpload(
        documentUpload: IDocumentUpload
    ): Observable<IDocumentUpload> {
        return this.http.post<IDocumentUpload>(
            `${BASE_URL}/document-upload/1`,
            documentUpload
        );
    }

    getDocumentUploads(): Observable<IDocumentUpload[]> {
        return this.http.get<IDocumentUpload[]>(`${BASE_URL}/document-upload`);
    }

    getDocumentUploadById(
        documentUploadId: string
    ): Observable<IDocumentUpload> {
        return this.http.get<IDocumentUpload>(
            `${BASE_URL}/document-upload/${documentUploadId}`
        );
    }

    updateDocumentUpload(
        documentUploadId: string,
        documentUpload: IDocumentUpload
    ): Observable<IDocumentUpload> {
        return this.http.put<IDocumentUpload>(
            `${BASE_URL}/document-upload/${documentUploadId}`,
            documentUpload
        );
    }

    // photo uploads
    createPhotoUpload(photoUpload: IPhotoUpload): Observable<IPhotoUpload> {
        return this.http.post<IPhotoUpload>(
            `${BASE_URL}/photo-upload`,
            photoUpload
        );
    }

    getPhotoUploads(): Observable<IPhotoUpload[]> {
        return this.http.get<IPhotoUpload[]>(`${BASE_URL}/photo-upload`);
    }

    getPhotoUploadById(photoUploadId: string): Observable<IPhotoUpload> {
        return this.http.get<IPhotoUpload>(
            `${BASE_URL}/photo-upload/${photoUploadId}`
        );
    }

    updatePhotoUpload(
        photoUploadId: string,
        photoUpload: IPhotoUpload
    ): Observable<IPhotoUpload> {
        return this.http.put<IPhotoUpload>(
            `${BASE_URL}/photo-upload/${photoUploadId}`,
            photoUpload
        );
    }

    // loss quantum
    createLossQuantum(lossQuantum: ILossQuantum): Observable<ILossQuantum> {
        return this.http.post<ILossQuantum>(
            `${BASE_URL}/loss-quantum`,
            lossQuantum
        );
    }

    getLossQuanta(): Observable<ILossQuantum[]> {
        return this.http.get<ILossQuantum[]>(`${BASE_URL}/loss-quantum`);
    }

    getLossQuantumById(lossQuantumId: string): Observable<ILossQuantum> {
        return this.http.get<ILossQuantum>(
            `${BASE_URL}/loss-quantum/${lossQuantumId}`
        );
    }

    updateLossQuantum(
        lossQuantumId: string,
        lossQuantum: ILossQuantum
    ): Observable<ILossQuantum> {
        return this.http.put<ILossQuantum>(
            `${BASE_URL}/loss-quantum/${lossQuantumId}`,
            lossQuantum
        );
    }

    // insurance companies ??? setups??
    createInsuranceCompany(
        insuranceCompany: IInsuranceCompany
    ): Observable<IInsuranceCompany> {
        return this.http.post<IInsuranceCompany>(
            `${BASE_URL}/insurance-company/1`,
            insuranceCompany
        );
    }

    getInsuranceCompanies(): Observable<IInsuranceCompany[]> {
        return this.http.get<IInsuranceCompany[]>(
            `${BASE_URL}/insurance-company`
        );
    }

    getInsuranceCompanyById(
        insuranceCompanyId: string
    ): Observable<IInsuranceCompany> {
        return this.http.get<IInsuranceCompany>(
            `${BASE_URL}/insurance-company/${insuranceCompanyId}`
        );
    }

    updateInsuranceCompany(
        insuranceCompanyId: string,
        insuranceCompany: IInsuranceCompany
    ): Observable<IInsuranceCompany> {
        return this.http.put<IInsuranceCompany>(
            `${BASE_URL}/insurance-company/${insuranceCompanyId}`,
            insuranceCompany
        );
    }

    countGenerator(number) {
        if (number <= 9999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    // generate cliam ID
    generateCliamID(totalClaims: number): string {
        const count = this.countGenerator(totalClaims);
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            ('0' + today.getDate()).slice(-2);

        return 'CL' + dateString + count;
    }
}
