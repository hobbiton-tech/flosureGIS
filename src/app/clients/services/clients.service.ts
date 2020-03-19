import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    IIndividualClient,
    ICorporateClient,
    IClient
} from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    DocumentReference
} from '@angular/fire/firestore';
import { AccountDetails } from '../models/account-details.model';
import { map } from 'rxjs/operators';
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
    }

    addIndividualClient(client: IIndividualClient): Promise<DocumentReference> {
        client.id = v4();
        client.clientType = 'Individual';
        return this.clientsCollection.add(client);
    }

    addCorporateClient(client: ICorporateClient): Promise<DocumentReference> {
        client.id = v4();
        client.clientType = 'Corporate';
        return this.clientsCollection.add(client);
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
        return this.clients;
    }

    countGenerator(number) {
        if (number<=99999) { number = ("0000"+number).slice(-5); }
        return number;
      }
      
      generateClientID(clientType: string, brokerName: string, totalClients: number) {
          const client_type = clientType.substring(0,3).toLocaleUpperCase();
          const broker_name = brokerName.substring(0,2).toLocaleUpperCase();
          const count = this.countGenerator(totalClients);
      
          return (client_type + broker_name + count);
      }
}
