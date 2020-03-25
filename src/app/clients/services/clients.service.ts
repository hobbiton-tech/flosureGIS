import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { IIndividualClient, ICorporateClient } from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference
} from '@angular/fire/firestore';
import { AccountDetails } from '../models/account-details.model';
import { map, first } from 'rxjs/operators';
import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private individualClientsCollection: AngularFirestoreCollection<IIndividualClient>;
    private corporateClientsCollection: AngularFirestoreCollection<ICorporateClient>;
    
    private accountDetailsCollection: AngularFirestoreCollection<
        AccountDetails
    >;

    individualClients: Observable<IIndividualClient[]>;
    corporateClients: Observable<ICorporateClient[]>;

    accountDetails: Observable<AccountDetails[]>;
    accountDetail: Observable<AccountDetails>;

    constructor(private firebase: AngularFirestore) {
        this.individualClientsCollection = this.firebase.collection<IIndividualClient>('individaul_clients');
        this.corporateClientsCollection = this.firebase.collection<ICorporateClient>('corporate_clients');

        this.individualClients = this.individualClientsCollection.valueChanges();
        this.corporateClients = this.corporateClientsCollection.valueChanges();

    }

    async addIndividualClient(client: IIndividualClient): Promise<void> {
        this.individualClients.pipe(first()).subscribe(async clients => {
            client.id = v4(); // Generates UUID of version 4.
            client.clientType = 'Individual';
            client.dateCreated = new Date();
            client.dateUpdated = new Date();
            client.status = 'Inactive';
            client.clientID = this.generateClientID(
                'Individual',
                'BR202000030',
                clients.length
            );

            await this.individualClientsCollection.add(client);
        });
    }

    async addCorporateClient(client: ICorporateClient): Promise<void> {
        this.corporateClients.pipe(first()).subscribe(async clients => {
            client.id = v4();
            client.dateCreated = new Date();
            client.dateUpdated = new Date();
            client.status = 'Inactive';
            client.clientID = this.generateClientID(
                'Corporate',
                'BR20200020',
                clients.length
            );
            client.clientType = 'Corporate';
            await this.corporateClientsCollection.add(client);
        });
    }

    addAccountDetails(
        accountDetail: AccountDetails
    ): Promise<DocumentReference> {
        return this.accountDetailsCollection.add(accountDetail);
    }

    getIndividaulClients(): Observable<IIndividualClient[]> {
        return this.individualClients;
    }

    getCorporateClients(): Observable<ICorporateClient[]> {
        return this.corporateClients;
    }

    getAllClients(): Observable<[IIndividualClient[], ICorporateClient[]]> {
        return combineLatest(this.individualClients, this.corporateClients)
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

        return clientTyp + brokerNam + count;
    }
}
