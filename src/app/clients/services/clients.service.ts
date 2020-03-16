import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { AccountDetails } from '../models/account-details.model';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {

    private clientsCollection: AngularFirestoreCollection<Client>;
    private accountDetailsCollection: AngularFirestoreCollection<
        AccountDetails
    >;
    private clientObject: AngularFirestoreDocument<Client>;
    clients: Observable<Client[]>;
    client: Observable<Client>;
    accountDetails: Observable<AccountDetails[]>;
    accountDetail: Observable<AccountDetails>;

    constructor(private firebase: AngularFirestore) {
        this.clientsCollection = firebase.collection<Client>('clients');
        this.accountDetailsCollection = firebase.collection<AccountDetails>(
            'account_details'
        );
        // this.clients = this.clientsCollection.valueChanges();
        this.clients = this.clientsCollection.snapshotChanges().pipe(
            map(changes => {
                return changes.map(a => {
                    const data = a.payload.doc.data() as Client;
                    data.id = a.payload.doc.id;
                    return data;
                });
            })
        );

        this.accountDetails = this.accountDetailsCollection
            .snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(a => {
                        const data = a.payload.doc.data() as AccountDetails;
                        data.id = a.payload.doc.id;
                        return data;
                    });
                })
            );
    }

    addClient(client: Client): void {
        // this.clients.
        this.clientsCollection
            .add(client)
            .then(mess => {
                // Do something
                console.log(client);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addAccountDetails(accountDetail: AccountDetails): void {
        // this.clients.
        this.accountDetailsCollection
            .add(accountDetail)
            .then(mess => {
                // Do something
                console.log(accountDetail);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getClients(): Observable<Client[]> {
        return this.clients;
    }

    getClient(id: string): Observable<Client> {
        this.clientObject = this.firebase.doc<Client>(`clients/${id}`);
        // this.clientObject = this.firebase.collection<Client>('clients', ref => ref.where('clientID', '==', id));

        this.client = this.clientObject.snapshotChanges().pipe(
            map(changes => {
                console.log('<========Data========>');
                console.log(changes);

                const data = changes.payload.data() as Client;
                return data;
            })
        );

        console.log(id);

        return this.client;
    }
}
