import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Claim } from '../../models/claim.model';
import { ClaimsService } from '../../services/claims-service.service';
import { ClaimSetupsService } from 'src/app/settings/components/claim-setups/services/claim-setups.service';
import { IClaimant } from 'src/app/settings/models/underwriting/claims.model';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';
import { ClientsService } from 'src/app/clients/services/clients.service';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    styleUrls: ['./claim-details.component.scss'],
})
export class ClaimDetailsComponent implements OnInit {
    claimData: Claim;
    id: string;
    claimantList: IClaimant[] = [];
    policiesList: Policy[];
    transactionsList: [] = [];

    displayClientList: Array<IIndividualClient & ICorporateClient>;
    clientList: Array<IIndividualClient & ICorporateClient>;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        private readonly policiesService: PoliciesService,
        private claimsService: ClaimsService,
        private readonly claimSetupsService: ClaimSetupsService,
        private readonly clientsService: ClientsService
    ) {}

    ngOnInit(): void {
        //get claimId from parameters
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.claimSetupsService.getClaimants().subscribe((claimants) => {
            this.claimantList = claimants;
        });

        this.claimsService.getClaims().subscribe((claims) => {
            this.claimData = claims.filter((x) => x.id === this.id)[0] as Claim;
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

    intimateClaim(): void {
        this.route.navigateByUrl('/flosure/claims/claim-transactions');
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

    getClient(id: string): any {
        const currentClient = this.displayClientList.filter(
            (x) => x.id === id
        )[0];
        return currentClient;
    }

    capitalize(s) {
        return s.toLowerCase().replace(/\b./g, function (a) {
            return a.toUpperCase();
        });
    }
}
