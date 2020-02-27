import { Component, OnInit } from '@angular/core';
import { generateClients } from 'src/app/clients/data/client.data';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  clientList = generateClients();
  constructor() { }

  ngOnInit(): void {
  }

}
