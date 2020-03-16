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
    Clients: Client[];
    clientList: any;
    corporate = 'Corporate';
    individual = 'Individual';
    // clientList = generateClients();
    preLoader = true;
    constructor(
        private router: Router,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.clientsService.getClients().subscribe(clients => {
            this.Clients = [];
            clients.forEach(client => {
                const a = client;
                this.Clients.push(a as Client);
            });
            console.log(this.Clients);
        });
    }

    viewDetails(client: Client): void {
        this.router.navigateByUrl('/clients/client-details/' + client.id);
    }

    addClient(client: Client): void {
        this.clientsService.addClient(client);
    }

    // getClients() {

    // }
}
