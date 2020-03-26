import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { ClientsService } from '../clients/services/clients.service';
import { ClaimsService } from '../claims/services/claims-service.service';
import { PoliciesService } from '../underwriting/services/policies.service';

import * as _ from 'lodash';
import { Policy } from '../underwriting/models/policy.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    clientsCount = 0;
    claimsCount = 0;
    policiesCount = 0;

    totalPolicies = 0;
    activePolices = 0;
    inactivePolicies = 0;

    cancelledPoliciesCount: number;
    commissionEarned = 0;

    clientsLoading = true;
    claimsLoading = true;
    policiesLoading = true;

    activePoliciesList: Policy[];

    expiredPoliciesList: Policy[];

    constructor(
        private clientsService: ClientsService,
        private claims: ClaimsService,
        private policiesService: PoliciesService,
        private readonly route: Router
    ) {}

    ngOnInit(): void {
        // Using reduce to combine all the clients.
        this.clientsService.getAllClients().subscribe(clients => {
            const combined = [clients[0], clients[1]].reduce(
                (x, y) => [...x, ...y],
                []
            );

            this.clientsCount = combined.length;
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

        this.policiesService.getPolicies().subscribe(activePolices => {
            this.activePoliciesList = _.filter(
                activePolices,
                x => x.status === 'Active'
            );
            console.log(this.activePoliciesList);
        });

        this.policiesService.getPolicies().subscribe(expiredPolices => {
            this.expiredPoliciesList = _.filter(
                expiredPolices,
                x => x.status === 'Expired'
            );
            console.log(this.expiredPoliciesList);
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.route.navigateByUrl(
            '/flosure/underwriting/policy-details/' + policy.policyNumber
        );
    }
}
