import { Component, OnInit } from '@angular/core';
import { generateClients } from 'src/app/clients/data/client.data';
import { Client } from '../../models/clients.model';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  clientList = generateClients();
  constructor(private router: Router, private readonly clientsService: ClientsService) { }

  ngOnInit(): void {
  }

  viewDetails(client: Client): void {
    this.router.navigateByUrl('/clients/client-details');
  }

  addClient(client: Client): void {
    this.clientsService.addClient(client);
}


}
