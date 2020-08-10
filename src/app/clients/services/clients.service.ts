import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { IIndividualClient, ICorporateClient } from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
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
    ICompanyDetails,
} from '../models/client.model';
import { IAccount } from 'src/app/settings/models/organizational/account.model';

const BASE_URL = 'https://www.flosure-api.com';

@Injectable({
    providedIn: 'root',
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
        this.getIndividualClients().subscribe((totalIndividaulClients) => {
            this.individualClients = totalIndividaulClients;
        });

        this.getCorporateClients().subscribe((totalCorporateClients) => {
            this.corporateClients = totalCorporateClients;
        });
        // this.individualClientsCollection = this.firebase.collection<
        //     IIndividualClient
        /// >('individaul_clients');
        // this.corporateClientsCollection = this.firebase.collection<
        //     ICorporateClient
        // >('corporate_clients');
        // this.individualClients = this.individualClientsCollection.valueChanges();
        // this.corporateClients = this.corporateClientsCollection.valueChanges();
    }

    // async addIndividualClient(client: IIndividualClient): Promise<void> {
    //     this.individualClients.pipe(first()).subscribe(async (clients) => {
    //         client.id = v4(); // Generates UUID of version 4.
    //         client.clientType = 'Individual';
    //         client.dateCreated = new Date();
    //         client.dateUpdated = new Date();
    //         client.status = 'Inactive';
    // client.clientID = this.generateClientID(
    //     'Individual',
    //     'BR202000030',
    //     clients.length
    // );

    //         await this.individualClientsCollection.add(client);
    //     });
    // }

    // async addCorporateClient(client: ICorporateClient): Promise<void> {
    //     this.corporateClients.pipe(first()).subscribe(async (clients) => {
    //         client.id = v4();
    //         client.dateCreated = new Date();
    //         client.dateUpdated = new Date();
    //         client.status = 'Inactive';
    //         client.clientID = this.generateClientID(
    //             'Corporate',
    //             'BR20200020',
    //             clients.length
    //         );
    //         client.clientType = 'Corporate';
    //         await this.corporateClientsCollection.add(client);
    //     });
    // }

    // New flosure api

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
            dateOfBirth: client.dateOfBirth,
        };

        const account: IAccountDetails = {
            bank: client.bank,
            branch: client.branch,
            tpinNumber: client.tpinNumber,
            accountName: client.accountName,
            accountNumber: client.accountNumber,
            accountType: client.accountType,
        };

        const addAccountDetails$ = (id) =>
            this.http.post<IAccountDetails>(
                `${BASE_URL}/clients/account-details`,
                { clientId: id, ...account }
            );

        return this.http
            .post<IClient>(`${BASE_URL}/clients`, clnt)
            .pipe(switchMap((x) => addAccountDetails$(x.id)));
    }

    createCorporateClient(client: IClientDTO) {
        const clnt: IClientCorporate = {
            clientType: 'Corporate',
            firstName: client.firstName,
            lastName: client.lastName,
            phoneNumber: client.phoneNumber,
            email: client.email,
            address: client.address,
            sector: client.sector,
            status: client.status,
        };

        const companyDetails: ICompanyDetails = {
            registrationNumber: client.registrationNumber,
            companyName: client.companyName,
            companyAddress: client.companyAddress,
            companyEmail: client.companyEmail,
            tpinNumber: client.tpinNumber,
        };

        const account: IAccountDetails = {
            bank: client.bank,
            branch: client.branch,
            tpinNumber: client.tpinNumber,
            accountName: client.accountName,
            accountNumber: client.accountNumber,
            accountType: client.accountType,
        };

        const addAccountDetails$ = (id) =>
            this.http.post<IAccountDetails>(
                `${BASE_URL}/clients/account-details`,
                { clientId: id, ...account }
            );

        const addCompanyDetails$ = (id) =>
            this.http.post<ICompanyDetails>(
                `${BASE_URL}/clients/company-details`,
                { clientId: id, ...companyDetails }
            );

        return this.http
            .post<IClient>(`${BASE_URL}/clients`, clnt)
            .pipe(switchMap((x) => addCompanyDetails$(x.id)));
    }

    getClients(): Observable<IClientDTO[]> {
        return this.http.get<IClientDTO[]>(`${BASE_URL}/clients`);
    }

    addCorporateClient(client: ICorporateClient): Observable<ICorporateClient> {
        // this.http
        //     .get<any>(
        //         `https://flosure-number-generation.herokuapp.com/aplus-client-number/COR`
        //     )
        //     .subscribe((res) => {
        //         console.log('Client ID>>>>>>', res.data.client_number);
        //         this.clientID = res.data.client_number;
        //     });
        // client.clientType = 'Corporate';
        // client.dateCreated = new Date();
        // client.dateUpdated = new Date();
        // client.status = 'Inactive';
        // client.clientID = this.clientID;
        // console.log(client);
        return this.http.post<ICorporateClient>(
            'https://www.flosure-api.com/clients/corporate',

            client
        );
    }

    getCorporateClients(): Observable<ICorporateClient[]> {
        return this.http.get<ICorporateClient[]>(
            'https://www.flosure-api.com/clients/corporate'
        );
    }

    getCorporateClient(id: string): Observable<ICorporateClient> {
        return this.http.get<ICorporateClient>(
            `https://www.flosure-api.com/clients/corporate/${id}`
        );
    }

    updateCorporateClient(
        client: ICorporateClient,
        id: string
    ): Observable<ICorporateClient> {
        return this.http.put<ICorporateClient>(
            `https://www.flosure-api.com/clients/corporate/${id}`,

            client
        );
    }

    addIndividualClient(
        client: IIndividualClient
    ): Observable<IIndividualClient> {
        // this.http
        //     .get<any>(
        //         `https://flosure-number-generation.herokuapp.com/aplus-client-number/IND`
        //     )
        //     .subscribe((res) => {
        //         console.log('Client ID>>>>>>', res.data.client_number);
        //         this.clientID = res.data.client_number;
        //     });

        return this.http.post<IIndividualClient>(
            'https://www.flosure-api.com/clients/individual',

            client
        );
    }

    getIndividualClients(): Observable<IIndividualClient[]> {
        return this.http.get<IIndividualClient[]>(
            'https://www.flosure-api.com/clients/individual'
        );
    }

    getIndividualClient(id: string): Observable<IIndividualClient> {
        return this.http.get<IIndividualClient>(
            `https://www.flosure-api.com/clients/individual/${id}`
        );
    }


    // async updateIndividualClients(individualClient: IIndividualClient): Promise<void> {
    //     return this.individualClientsCollection
    //         .doc(`${individualClient.id}`)
    //         .update(individualClient)
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }


    updateIndividualClient(
        client: IIndividualClient,
        id: string
    ): Observable<IIndividualClient> {
        return this.http.put<IIndividualClient>(
            `https://www.flosure-api.com/clients/individual/${id}`,
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

    generateClientID(
        clientType: string,
        brokerName: string,
        totalClients: number
    ) {
        const clientTyp = clientType.substring(0, 3).toLocaleUpperCase();
        const brokerNam = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalClients);

        return clientTyp + brokerName + count;
    }
}
