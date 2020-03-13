import { Component, OnInit } from '@angular/core';
import { generateClients } from './data/client.data';
import { ClientsService } from './services/clients.service';
import { Client } from './models/clients.model';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    clientList = generateClients();

    constructor(private readonly clientsService: ClientsService) {}

    ngOnInit(): void {}

    addClient(client: Client): void {
        this.clientsService.addClient(client);
    }


}
