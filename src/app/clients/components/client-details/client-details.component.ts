import {
    Component,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core';
import {
    ICorporateClient,
    IIndividualClient,
} from '../../models/clients.model';
import { Router, ActivatedRoute } from '@angular/router';
// import { AccountDetails } from '../../models/account-details.model';
import { ClientsService } from '../../services/clients.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Claim } from 'src/app/claims/models/claim.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';

import { getDate } from 'date-fns';
import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';

@Component({
    selector: 'app-client-details',
    templateUrl: './client-details.component.html',
    styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent implements OnInit, AfterViewInit {
    isEditmode = false;

    client: IIndividualClient & ICorporateClient;
    clientPolicies: Policy[] = [];
    clientClaims: Claim[] = [];

    // account: AccountDetails;
    id: string;

    constructor(
        private readonly route: Router,
        private cdr: ChangeDetectorRef,
        private router: ActivatedRoute,
        private clientsService: ClientsService,
        private policyService: PoliciesService,
        private claimsService: ClaimsService
    ) {}

    ngOnInit(): void {
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.clientsService.getAllClients().subscribe((clients) => {
            console.log(clients);
            this.client = [...clients[1], ...clients[0]].filter(
                (x) => x.id === this.id
            )[0] as IIndividualClient & ICorporateClient;

            console.log('CLIENTS', this.client);
        });

        // this.policyService.getClientsPolicies(this.id).subscribe(policies => {
        //     this.clientPolicies = policies;
        // });

        // this.claimsService.getClientsClaims(this.id).subscribe(claims => {
        //     this.clientClaims = claims;
        // });
    }

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    goToClientsList(): void {
        this.route.navigateByUrl('/flosure/clients/clients-list');
    }

    viewPolicyDetails(): void {
        this.route.navigateByUrl('/flosure/underwriting/policy-details');
    }

    viewClaimDetails(): void {
        this.route.navigateByUrl('/flosure/claims/claim-details');
    }

    getTimeStamp(client: ICorporateClient & IIndividualClient): number {
        const date = client.dateCreated as ITimestamp;
        return date.seconds;
    }
}
