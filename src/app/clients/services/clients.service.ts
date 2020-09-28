import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { IIndividualClient, ICorporateClient } from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from '@angular/fire/firestore';
import { first, switchMap } from 'rxjs/operators';
import { v4 } from 'uuid';

import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import {
  IClient,
  IAccountDetails,
  IClientDTO,
  IClientCorporate,
  ICompanyDetails, TransactionModel
} from '../models/client.model';
import { IAccount } from 'src/app/settings/models/organizational/account.model';

const BASE_URL = 'http://localhost:3001';

// const BASE__STATEMENT_URL = 'http://localhost:8022/transaction';
const BASE__STATEMENT_URL = 'https://payment-api.savenda-flosure.com/transaction';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private individualClientsCollection: AngularFirestoreCollection<
        IIndividualClient
    >;
    private corporateClientsCollection: AngularFirestoreCollection<
        ICorporateClient
    >;

    individualClients: IIndividualClient[];
    corporateClients: ICorporateClient[];
    post: void;
    clientID = '';

    constructor(private http: HttpClient, private firebase: AngularFirestore) {
        this.getIndividualClients().subscribe(totalIndividaulClients => {
            this.individualClients = totalIndividaulClients;
        });

        this.getCorporateClients().subscribe(totalCorporateClients => {
            this.corporateClients = totalCorporateClients;
        });
    }


    createIndividualClient(client: IClientDTO) {
        const clnt: IClient = {
            clientType: 'Individual',
            firstName: client.firstName,
            lastName: client.lastName,
            phoneNumber: client.phoneNumber,
            email: client.email,
            address: client.address,
            idType: client.idType,
            idNumber: client.idNumber,
            title: client.title,
            maritalStatus: client.maritalStatus,
            gender: client.gender,
            sector: client.sector,
            occupation: client.occupation,
            dateOfBirth: client.dateOfBirth
        };

        const account: IAccountDetails = {
            bank: client.bank,
            branch: client.branch,
            tpinNumber: client.tpinNumber,
            accountName: client.accountName,
            accountNumber: client.accountNumber,
            accountType: client.accountType
        };

        const addAccountDetails$ = id =>
            this.http.post<IAccountDetails>(
                `${BASE_URL}/clients/account-details`,
                { clientId: id, ...account }
            );

        return this.http
            .post<IClient>(`${BASE_URL}/clients`, clnt)
            .pipe(switchMap(x => addAccountDetails$(x.id)));
    }



    addCorporateClient(client: ICorporateClient): Observable<ICorporateClient> {

        return this.http.post<ICorporateClient>(
            `${BASE_URL}/clients/corporate`,

            client
        );
    }

    getCorporateClients(): Observable<ICorporateClient[]> {
        return this.http.get<ICorporateClient[]>(
            `${BASE_URL}/clients/corporate`
        );
    }

    getCorporateClient(id: string): Observable<ICorporateClient> {
        return this.http.get<ICorporateClient>(
            `${BASE_URL}/clients/corporate/${id}`
        );
    }

    updateCorporateClient(
        client: ICorporateClient,
        id: string
    ): Observable<ICorporateClient> {
        return this.http.put<ICorporateClient>(
            `${BASE_URL}/clients/corporate/${id}`,

            client
        );
    }

    addIndividualClient(
        client: IIndividualClient
    ): Observable<IIndividualClient> {


        return this.http.post<IIndividualClient>(
            `${BASE_URL}/clients/individual`,

            client
        );
    }

    getIndividualClients(): Observable<IIndividualClient[]> {
        return this.http.get<IIndividualClient[]>(
            `${BASE_URL}/clients/individual`
        );
    }

    getIndividualClient(id: string): Observable<IIndividualClient> {
        return this.http.get<IIndividualClient>(
            `${BASE_URL}/clients/individual/${id}`
        );
    }

    updateIndividualClient(
        client: IIndividualClient,
        id: string
    ): Observable<IIndividualClient> {
        return this.http.put<IIndividualClient>(
            `${BASE_URL}/clients/individual/${id}`,
            client
        );
    }

    getAllClients(): Observable<[IIndividualClient[], ICorporateClient[]]> {
        // tslint:disable-next-line: deprecation
        return combineLatest(
            this.getIndividualClients(),
            this.getCorporateClients()
        );
    }

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    createTransaction(txn: TransactionModel) {
      return this.http.post<TransactionModel>(`${BASE__STATEMENT_URL}`, txn);
    }

    getTransactions() {
      return this.http.get(`${BASE__STATEMENT_URL}`);
    }
}
