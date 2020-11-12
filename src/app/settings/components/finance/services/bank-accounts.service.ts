import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBankAccount } from 'src/app/settings/models/bank-account.model';
import { Observable } from 'rxjs';
import { IChequeModel } from 'src/app/settings/models/cheque.model';

const BASE_URL = 'https://savenda.flosure-api.com/';

@Injectable({
    providedIn: 'root'
})
export class BankAccountsService {
    constructor(private http: HttpClient) {}

    addBankAccount(bankAccount: IBankAccount): Observable<IBankAccount> {
        return this.http.post<IBankAccount>(
            `${BASE_URL}/bank-account/1`,
            bankAccount
        );
    }

    getBankAccounts(): Observable<IBankAccount[]> {
        return this.http.get<IBankAccount[]>(`${BASE_URL}/bank-account`);
    }

    getBankAccountById(bankAccountId: string): Observable<IBankAccount> {
        return this.http.get<IBankAccount>(
            `${BASE_URL}/bank-account/${bankAccountId}`
        );
    }

    updateBankAccount(
        bankAccount: IBankAccount,
        bankAccountId: string
    ): Observable<IBankAccount> {
        return this.http.put<IBankAccount>(
            `${BASE_URL}/bank-account/${bankAccountId}`,
            bankAccount
        );
    }

    // Cheques
    addChequeRange(
        bankAccountId: string,
        cheque: IChequeModel
    ): Observable<IChequeModel> {
        return this.http.post<IChequeModel>(
            `${BASE_URL}/cheques/${bankAccountId}`,
            cheque
        );
    }

    getChequeRanges(): Observable<IChequeModel[]> {
        return this.http.get<IChequeModel[]>(`${BASE_URL}/cheques`);
    }

    getChequeRangeById(chequeRangeId: string): Observable<IChequeModel> {
        return this.http.get<IChequeModel>(
            `${BASE_URL}/cheques/${chequeRangeId}`
        );
    }

    updateChequeRange(
        chequeRange: IChequeModel,
        chequeRangeId: string
    ): Observable<IChequeModel> {
        return this.http.put<IChequeModel>(
            `${BASE_URL}/cheques/${chequeRangeId}`,
            chequeRange
        );
    }
}
