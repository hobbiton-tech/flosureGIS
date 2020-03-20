import { Component, OnInit } from '@angular/core';
import {
    IClient,
    IIndividualClient,
    ICorporateClient,
    ClientType
} from '../../models/clients.model';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-clients-list',
    templateUrl: './clients-list.component.html',
    styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
    clientList: IClient[];
    isAddClientDrawerOpen: boolean = false;
    selectedClientType: ClientType = 'Individual';

    totalClients: number = 0;
    individualClients: IIndividualClient[];
    totalIndividualClients: number = 0;
    corporateClients: ICorporateClient[];
    totalCorporateClients: number = 0;

    clientsLoading: boolean = true;

    constructor(
        private router: Router,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.clientsService.getClients().subscribe(clients => {
            this.clientList = clients;
            this.totalClients = clients.length;

            this.individualClients = _.filter(
                clients,
                x => x.clientType === 'Individual'
            ) as IIndividualClient[];

            this.corporateClients = _.filter(
                clients,
                x => x.clientType === 'Corporate'
            ) as ICorporateClient[];

            this.totalIndividualClients = this.individualClients.length;
            this.totalCorporateClients = this.corporateClients.length;

            this.clientsLoading = false;
        });
    }

    viewDetails(client: IClient): void {
        this.router.navigateByUrl(
            '/flosure/clients/client-details/' + client.id
        );
    }

    addIndividualClient(client: IIndividualClient): void {
        this.clientsService.addIndividualClient(client);
    }

    addCorporateClient(client: ICorporateClient): void {
        this.clientsService.addCorporateClient(client);
    }
}
