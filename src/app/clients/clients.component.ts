import { Component, OnInit } from '@angular/core';
import { generateClients } from './data/client.data';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    clientList = generateClients();

    constructor() {}

    ngOnInit(): void {}
}
