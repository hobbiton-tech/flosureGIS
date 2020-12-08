import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CPaymentModel } from '../components/models/commission-payment.model';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommissionPaymentService {
  cPayment: CPaymentModel;
  cPayments: CPaymentModel[] = [];
  BASEURLCPayment = 'https://test-pay.flosure-api.com';


  constructor(private http: HttpClient,
              private message: NzMessageService,
              private router: Router) { }

    createCPayment(createCPay: CPaymentModel): Observable<CPaymentModel> {
      return this.http.post<CPaymentModel>(`${this.BASEURLCPayment}/commission-Processing`, createCPay);
    }

    updateCPayment(cPayment: any) {
      return this.http.put<any>(`${this.BASEURLCPayment}/commission-Processing/${cPayment.ID}`, cPayment);
    }

    getCPayment(): Observable<any> {
      return this.http.get<any>(`${this.BASEURLCPayment}/commission-Processing`);
  }


}
