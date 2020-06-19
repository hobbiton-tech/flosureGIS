import { Component, OnInit } from '@angular/core';
import {
    IIndividualClient,
    ICorporateClient
} from '../../models/clients.model';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-clients-list',
    templateUrl: './clients-list.component.html',
    styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
    clientList: Array<IIndividualClient & ICorporateClient>;
    displayClientList: Array<IIndividualClient & ICorporateClient>;
    searchedClientList: Array<IIndividualClient & ICorporateClient>;

    clientUpdate = new BehaviorSubject<boolean>(false);

    isAddClientDrawerOpen = false;

    totalClients = 0;
    individualClients: IIndividualClient[];
    totalIndividualClients = 0;
    corporateClients: ICorporateClient[];
    totalCorporateClients = 0;

    clientsLoading = true;

    //search string when filtering clients
    searchString: string;

    /*name of the excel-file which will be downloaded. */

    fileName = 'ClientsSheet.xlsx';

    constructor(
        private router: Router,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        this.clientsService.getAllClients().subscribe(clients => {
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

        this.clientUpdate.subscribe(update =>
            update === true
                ? this.clientsService.getAllClients().subscribe(clients => {
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
                  })
                : ''
        );
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      capitalize(s){
        return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
    };

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

    search(value: string): void {
        if (value === '' || !value) {
            this.displayClientList = this.clientList;
        }

        this.displayClientList = this.clientList.filter(client => {
            if (client.clientType === 'Individual') {
                return (
                    client.clientID
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.clientType
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.status
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.firstName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.lastName.toLowerCase().includes(value.toLowerCase())
                );
            } else {
                return (
                    client.clientID
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.clientType
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.status
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    client.companyName
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        });
    }

    downloadClientsList() {
        let element = document.getElementById('clientsTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    recieveUpdate($event) {
        this.clientUpdate.next($event);
    }
}
