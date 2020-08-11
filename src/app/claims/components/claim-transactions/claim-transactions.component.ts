import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';
import { ClaimSetupsService } from 'src/app/settings/components/claim-setups/services/claim-setups.service';
import { IClaimant } from 'src/app/settings/models/underwriting/claims.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import {
    ICorporateClient,
    IIndividualClient,
} from 'src/app/clients/models/clients.model';
import { ClientsService } from 'src/app/clients/services/clients.service';

@Component({
    selector: 'app-claim-transactions',
    templateUrl: './claim-transactions.component.html',
    styleUrls: ['./claim-transactions.component.scss'],
})
export class ClaimTransactionsComponent implements OnInit {
    claimsList: Claim[];
    displayClientList: Array<IIndividualClient & ICorporateClient>;
    clientList: Array<IIndividualClient & ICorporateClient>;
    displayClaimsList: Claim[];
    claimsCount: number = 0;

    policiesList: Policy[];

    searchString: string;

    //spin feedback when loading figures
    claimsLoading: boolean = true;

    constructor(
        private readonly route: Router,
        private readonly claimsService: ClaimsService,
        private readonly policiesService: PoliciesService,
        private readonly clientsService: ClientsService
    ) {}

    viewClaimDetails(claim: Claim): void {
        this.route.navigateByUrl('/flosure/claims/claim-details/' + claim.id);
    }

    // async addClaim(claim: Claim): Promise<void> {
    //     await this.claimsService.addClaim(claim);
    // }

    ngOnInit(): void {
        this.claimsService.getClaims().subscribe((claims) => {
            this.claimsCount = claims.length;
            this.claimsLoading = false;
            // this.claimsList = claims;

            this.displayClaimsList = claims;
        });

        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
        });

        this.clientsService.getAllClients().subscribe((clients) => {
            this.clientList = [...clients[0], ...clients[1]] as Array<
                ICorporateClient & IIndividualClient
            >;
            this.displayClientList = this.clientList;
        });
    }

    getClient(id: string): any {
        const currentClient = this.displayClientList.filter(
            (x) => x.id === id
        )[0];
        return currentClient;
    }

    getRisk(policyNumber: string, riskId: string): RiskModel {
        const policy = this.policiesList.filter(
            (x) => x.policyNumber == policyNumber
        )[0] as Policy;

        const risk = policy.risks.filter(
            (y) => (y.id = riskId)
        )[0] as RiskModel;

        return risk;
    }

    capitalize(s) {
        return s.toLowerCase().replace(/\b./g, function (a) {
            return a.toUpperCase();
        });
    }

    // search(value: string): void {
    //     if (value === '' || !value) {
    //         this.displayClaimsList = this.claimsList;
    //     }

    //     this.displayClaimsList = this.claimsList.filter(claim => {
    //             return (claim.claimId.toLowerCase().includes(value.toLowerCase())
    //         || claim.policyNumber.toLocaleLowerCase().includes(value.toLowerCase())
    //         || claim.clientName.toLocaleLowerCase().includes(value.toLowerCase())
    //         || claim.status.toLocaleLowerCase().includes(value.toLowerCase()));
    //     });
    // }
}
