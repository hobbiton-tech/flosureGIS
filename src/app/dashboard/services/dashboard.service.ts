import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../clients/models/clients.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import 'firebase/firestore';
import { ClientsService } from '../../clients/services/clients.service'
import { DashboardSummary } from '../models/summary.model';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  // clientsCount: number;
  constructor(private firebase: AngularFirestore, private readonly clientsService: ClientsService) { }

  // ngOnInit(): void {
  //   console.log('Initialized');
  //   this.clientsService.getClients().subscribe((clients) => {
  //     this.clientsCount =  clients.length;
  //     console.log(clients);
  //   })
  // }

  getClientsCount() { 
    
    
     //this.firebase.collection('clients')
  }

  getSummary(): Observable<DashboardSummary> {
    // Pull clients
    // Pull claims
    return 
  }

  
}
