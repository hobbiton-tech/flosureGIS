import { Component, OnInit } from '@angular/core';
import {
    ClientType,
    IIndividualClient,
    ICorporateClient
} from '../../models/clients.model';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as _ from 'lodash';

@Component({
    selector: 'app-clients-list',
    templateUrl: './clients-list.component.html',
    styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
    // clientList: IIndividualClient[] & ICorporateClient[];

    clientList: Array<IIndividualClient & ICorporateClient>;
    displayClientList: Array<IIndividualClient & ICorporateClient>;

    isAddClientDrawerOpen = false;
    selectedClientType: ClientType = 'Individual';

    individualClientForm: FormGroup;

    corporateClientForm: FormGroup;

    totalClients = 0;
    individualClients: IIndividualClient[];
    totalIndividualClients = 0;
    corporateClients: ICorporateClient[];
    totalCorporateClients = 0;

    clientsLoading = true;

    constructor(
        private router: Router,
        private readonly clientsService: ClientsService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.clientsService.getAllClients().subscribe(clients => {
            this.individualClients = clients[0];
            this.corporateClients = clients[1];

            this.totalIndividualClients = clients[0].length;
            this.totalCorporateClients = clients[1].length;

            // I'm not sure this actually works. Still doing some research on intersection types.
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

    addIndividualClient(client: IIndividualClient): void {
        this.clientsService.addIndividualClient(client);
    }

    addCorporateClient(client: ICorporateClient): void {
        this.clientsService.addCorporateClient(client);
    }

    filterClients(filter: 'All' | 'Individaul' | 'Corporate'): void {
        switch (filter) {
            case 'All':
                this.displayClientList = this.clientList;
            case 'Individaul':
                this.displayClientList = this.individualClients as Array<
                    IIndividualClient & ICorporateClient
                >;
            case 'Corporate':
                this.displayClientList = this.corporateClients as Array<
                    IIndividualClient & ICorporateClient
                >;
        }
    }
}
