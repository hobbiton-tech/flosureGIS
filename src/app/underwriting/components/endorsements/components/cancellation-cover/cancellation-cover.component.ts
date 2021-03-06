import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cancellation-cover',
    templateUrl: './cancellation-cover.component.html',
    styleUrls: ['./cancellation-cover.component.scss']
})
export class CancellationCoverComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];

    searchString: string;

    constructor(
        private readonly router: Router,
        private readonly policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.displayPoliciesList = this.policiesList;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-cancellation-details/' + policy.id
        );
    }

    viewPolicyCancelledDetails(policy: Policy): void{
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-cancellation-details/' + policy.id
        );
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayPoliciesList = this.policiesList;
        }

        this.displayPoliciesList = this.policiesList.filter(policy => {
            return (
                policy.policyNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                policy.client.toLowerCase().includes(value.toLowerCase())
            );
        });
    }
}
