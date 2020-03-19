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

    countGenerator(number) {
        if (number<=99999) { number = ("000"+number).slice(-4); }
        return number;
      }
      
      //Genereating quote number
    generateQuoteNumber(brokerCode: string, totalQuotes: number) {
        const broker_code = brokerCode;
          const today = new Date();
          const dateString: string = today.getFullYear().toString().substr(-2) + ("0"+(today.getMonth()+1)).slice(-2) +  + ("0" + today.getDate()).slice(-2);
          const count = this.countGenerator(totalQuotes);
          return ("QO" + brokerCode + dateString + count)
    }
}