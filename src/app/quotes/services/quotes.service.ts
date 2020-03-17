import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel } from '../models/quote.model';
import { Observable } from 'rxjs';

@Injectable()
export class QuoteService {
    addMotorQuotation(quotation: MotorQuotationModel): void {

    }

    addRisk(risk: RiskModel): void {

    }

    getRisks(): Observable<RiskModel[]> {
        return null;
    }

    generateQuoteNumber(brokerCode: string, totalQuotes: number) {
        
    }
}