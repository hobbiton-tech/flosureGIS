import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { ClientsService } from '../clients/services/clients.service';
import { ClaimsService } from '../claims/services/claims-service.service';
import { PoliciesService } from '../underwriting/services/policies.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    clientsCount: number = 0;
    claimsCount: number = 0;
    policiesCount: number = 0;

    totalPolicies: number = 0;
    activePolices: number = 0;
    inactivePolicies: number = 0;

    cancelledPoliciesCount: number;
    commissionEarned: number = 0;

    clientsLoading: boolean = true;
    claimsLoading: boolean = true;
    policiesLoading: boolean = true;

    constructor(
        private clients: ClientsService,
        private claims: ClaimsService,
        private policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.clients.getClients().subscribe(clients => {
            this.clientsCount = clients.length;
            this.clientsLoading = false;
        });
        this.claims.getClaims().subscribe(claims => {
            console.log('SOME', claims);
            this.claimsCount = claims.length;
            this.claimsLoading = false;
        });
        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesCount = policies.length;
            this.totalPolicies = policies.length;
            this.activePolices = _.filter(
                policies,
                x => x.status === 'Active'
            ).length;
            this.inactivePolicies = _.filter(
                policies,
                x => x.status === 'Expired'
            ).length;
            this.policiesLoading = false;
        });
    }

}

