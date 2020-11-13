import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { CPaymentModel } from '../components/models/commission-payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionInvoiceService {

  BASEURL = 'https://payment-api.savenda-flosure.com';

  // BASEURL = 'https://api.goldenlotusinsurance.com';

  constructor(private http: HttpClient,
              private message: NzMessageService,
              private router: Router) { }


  createTransaction(createCPay: any): Observable<any> {
    return this.http.post<any>(`${this.BASEURL}/transactionInvoice/invoice`, createCPay);
  }

  updateTransaction(cPayment: any) {
    return this.http.put<any>(`${this.BASEURL}/transactionInvoice/invoice/${cPayment.ID}`, cPayment);
  }

  getTransactiont(): Observable<any> {
    return this.http.get<any>(`${this.BASEURL}/transactionInvoice/invoice`);
  }
}
