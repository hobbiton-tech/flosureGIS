import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRequisitionPayment } from 'src/app/settings/models/requisition-payment.model';
import { Observable } from 'rxjs';

const BASE_URL = 'https://api.goldenlotusinsurance.com';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(private http: HttpClient) {}

    createRequisitionPayment(
        bankAccountId: string,
        requisitionPayment: IRequisitionPayment
    ): Observable<IRequisitionPayment> {
        return this.http.post<IRequisitionPayment>(
            `${BASE_URL}/requisition-payment/${bankAccountId}`,
            requisitionPayment
        );
    }

    getRequisitionPayments(): Observable<IRequisitionPayment[]> {
        return this.http.get<IRequisitionPayment[]>(
            `${BASE_URL}/requisition-payment`
        );
    }

    getRequisitionPaymentById(
        requisitionPaymentId: string
    ): Observable<IRequisitionPayment> {
        return this.http.get<IRequisitionPayment>(
            `${BASE_URL}/requisition-payment/${requisitionPaymentId}`
        );
    }

    updateRequisitionPayment(
        requisitionPayment: IRequisitionPayment,
        requisitionPaymentId: string
    ): Observable<IRequisitionPayment> {
        return this.http.put<IRequisitionPayment>(
            `${BASE_URL}/requisition-payment/${requisitionPaymentId}`,
            requisitionPayment
        );
    }
}
