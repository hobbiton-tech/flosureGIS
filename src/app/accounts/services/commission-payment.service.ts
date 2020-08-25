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
  cPayment: any;
  cPayments: any[] = [];
  BASEURLCPayment = '';

  constructor(private http: HttpClient,
    private message: NzMessageService,
    private router: Router) { }

    createCPayment(createCPay: any[]): Observable<any>
    {
      return this.http.post<CPaymentModel>(this.BASEURLCPayment, createCPay);
    }

    updateCPayment(cPayment: any[])
    {
      return this.http.put(`${this.BASEURLCPayment}/${this.cPayment}`,cPayment)
    }

    getCPayment(): Observable<any> {
      return this.http.get<any>(this.BASEURLCPayment);
  }


}
