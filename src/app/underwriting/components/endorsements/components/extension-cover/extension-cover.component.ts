import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-extension-cover',
    templateUrl: './extension-cover.component.html',
    styleUrls: ['./extension-cover.component.scss']
})
export class ExtensionCoverComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];

    extensionOfCoverListIsLoading = false;

    searchString: string;

    constructor(
        private readonly router: Router,
        private readonly policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.extensionOfCoverListIsLoading = true;
        setTimeout(() => {
            this.extensionOfCoverListIsLoading = false;
        }, 3000);

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.displayPoliciesList = this.policiesList;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-extension-details/' + policy.id
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
