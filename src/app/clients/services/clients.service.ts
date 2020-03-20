import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClient } from '../models/clients.model';
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
    private clientsCollection: AngularFirestoreCollection<IClient>;
    private accountDetailsCollection: AngularFirestoreCollection<
        AccountDetails
    >;

    clients: Observable<IClient[]>;

    accountDetails: Observable<AccountDetails[]>;
    accountDetail: Observable<AccountDetails>;

    constructor(private firebase: AngularFirestore) {
        this.clientsCollection = this.firebase.collection<IClient>('clients');
        this.clients = this.clientsCollection.valueChanges();
    }

    async addIndividualClient(client: IClient): Promise<void> {
        this.clients.pipe(first()).subscribe(async clients => {
            client.id = v4();
            client.clientType = 'Individual';
            client.clientID = this.generateClientID(
                'Individual',
                'BR202000030',
                clients.length
            );
            await this.clientsCollection.add(client);
        });
    }

    async addCorporateClient(client: IClient): Promise<void> {
        this.clients.pipe(first()).subscribe(async clients => {
            client.id = v4();
            client.clientID = this.generateClientID(
                'Corporate',
                'BR20200020',
                clients.length
            );
            client.clientType = 'Corporate';
            await this.clientsCollection.add(client);
        });
    }

    addAccountDetails(
        accountDetail: AccountDetails
    ): Promise<DocumentReference> {
        return this.accountDetailsCollection.add(accountDetail);
    }

    getClient(id: string): Observable<IClient> {
        return this.clients.pipe(map(x => x.find(y => y.id === id)));
    }

    getClients(): Observable<IClient[]> {
        console.log('HERE', this.clients);
        return this.clients;
    }

    countGenerator(number: string | number) {
        if (number <= 99999) {
            number = ('0000' + number).slice(-5);
        }
        return number;
    }

    generateClientID(
        clientType: string,
        brokerName: string,
        totalClients: number
    ) {
        const client_type = clientType.substring(0, 3).toLocaleUpperCase();
        const broker_name = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalClients);

        return client_type + broker_name + count;
    }
}
