import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    IPremiumReport,
    IPolicyReportDto,
    ICreditNoteReportDto,
    IDebitNoteReportDto,
    IIntermediaryReportDto,
    ICommissionReportDto,
} from '../model/premium';
import { switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BASE_URL = 'http://localhost:3000';
@Injectable({
    providedIn: 'root',
})
export class PremiumService {
    constructor(private readonly http: HttpClient) {}

    generateQuoteReport(){
        return this.http.get<any>(`${BASE_URL}/quotation`)
    }

    generateQuotationReport(){
        return this.http.get<any>(`${BASE_URL}/quotation`)
    }

    generateAnalysisReport(){
        return this.http.get<any>(`${BASE_URL}/quotation`)
    }

    generatePremiumReport(){
        return this.http.get<any>(`${BASE_URL}/report`)
    }

    generateReport() {
        // const policy: IPolicyReportDto = {
        //     policyNumber: premium.policyNumber,
        //     intermediaryName: premium.intermediaryName,
        //     class: 'Motor',
        //     startDate: premium.startDate,
        //     endDate: premium.endDate,
        //     sumInsured: premium.sumInsured,
        //     premium: premium.premium,
        // };

        // const credit: ICreditNoteReportDto = {
        //     creditNoteNumber: premium.creditNoteNumber,
        // };

        // const debit: IDebitNoteReportDto = {
        //     debitNoteNumber: premium.debitNoteNumber,
        // };

        // const intermediary: IIntermediaryReportDto = {
        //     intermediaryName: premium.intermediaryName,
        // };

        // const commission: ICommissionReportDto = {
        //     commission: premium.commission,
        // };

        const getCreditNote$ = (id) =>
            this.http.get<ICreditNoteReportDto>(`${BASE_URL}/documents/credit-notes/${id}`);

        const getDebitNote$ = (id) =>
            this.http.get<IDebitNoteReportDto>(`${BASE_URL}/documents/debit-notes/${id}`);

        const getIntermediary$ = (id) =>
            this.http.get<IIntermediaryReportDto>(`${BASE_URL}/intermediary/agent/${id}`);

        const getCommission$ = (id) =>
            this.http.get<ICommissionReportDto>(`${BASE_URL}/commission-setups/${id}`);

        return this.http
            .get<IPolicyReportDto>(`${BASE_URL}/policy`)
            .pipe(
                switchMap((x) =>
                    forkJoin(
                        getCreditNote$(x.id),
                        getDebitNote$(x.id),
                        getIntermediary$(x.id).pipe(
                            switchMap((x) => getCommission$(x.id))
                        )
                    )
                )
            );
    }
}
