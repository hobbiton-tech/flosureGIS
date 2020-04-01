import { Component, OnInit } from '@angular/core';
import {
    IIndividualClient,
    ICorporateClient,
} from '../../models/client.model';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';

@Component({
    selector: 'app-clients-list',
    templateUrl: './clients-list.component.html',
    styleUrls: ['./clients-list.component.scss'],
})
export class ClientsListComponent implements OnInit {
    clientList: Array<IIndividualClient & ICorporateClient>;
    displayClientList: Array<IIndividualClient & ICorporateClient>;

    isAddClientDrawerOpen = false;

    totalClients = 0;
    individualClients: IIndividualClient[];
    totalIndividualClients = 0;
    corporateClients: ICorporateClient[];
    totalCorporateClients = 0;

    clientsLoading = true;

    constructor(
        private router: Router,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.clientsService.getAllClients().subscribe((clients) => {
            this.individualClients = clients[0];
            this.corporateClients = clients[1];

            this.totalIndividualClients = clients[0].length;
            this.totalCorporateClients = clients[1].length;

            this.clientList = [...clients[0], ...clients[1]] as Array<
                ICorporateClient & IIndividualClient
            >;
            this.displayClientList = this.clientList;

            this.totalClients = this.clientList.length;

            this.clientsLoading = false;
        });
    }

    viewDetails(client: IIndividualClient | ICorporateClient): void {
        this.router.navigateByUrl(
            '/flosure/clients/client-details/' + client.id
        );
    }
}
