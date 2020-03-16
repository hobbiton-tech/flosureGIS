import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/clients.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private clientsCollection: AngularFirestoreCollection<Client>;
  clients: Observable<Client[]>;

  constructor(private firebase: AngularFirestore) {
    this.clientsCollection = firebase.collection<Client>('clients');
    this.clients = this.clientsCollection.valueChanges();
   }

   addClient(client: Client): void {
     // this.clients.
     this.clientsCollection.add(client)
      .then((mess) => {
        // Do something
        console.log(mess);
      })
      .catch((err) => {
        console.log(err);
      })
   }

   getClients(): Observable<Client[]> {
     return this.clients;
   }
}
