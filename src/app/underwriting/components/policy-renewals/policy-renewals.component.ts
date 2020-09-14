import { Component, OnInit } from '@angular/core';
import { Policy } from '../../models/policy.model';
import { Router } from '@angular/router';
import { PoliciesService } from '../../services/policies.service';
import _ from 'lodash';

@Component({
    selector: 'app-policy-renewals',
    templateUrl: './policy-renewals.component.html',
    styleUrls: ['./policy-renewals.component.scss']
})
export class PolicyRenewalsComponent implements OnInit {
    // loading feedback
    policyRenewalsDetailsIsLoading = false;

    policiesList: Policy[];
    displayPoliciesList: Policy[];
    policiesCount = 0;

    issuedBy = localStorage.getItem('user');

    searchString: string;

    constructor(
        private readonly route: Router,
        private policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.policyRenewalsDetailsIsLoading = true;
        setTimeout(() => {
            this.policyRenewalsDetailsIsLoading = false;
        }, 3000);

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = _.filter(
                policies,
                x =>
                    x.receiptStatus === 'Receipted' &&
                    x.paymentPlan === 'Created'
            );

            this.policiesCount = _.filter(
                policies,
                x =>
                    x.receiptStatus === 'Receipted' &&
                    x.paymentPlan === 'Created'
            ).length;

            this.displayPoliciesList = this.policiesList;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.route.navigateByUrl(
            '/flosure/underwriting/policy-renewal-details/' + policy.id
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
                policy.client
                    .toLocaleLowerCase()
                    .includes(value.toLowerCase()) ||
                policy.status.toLocaleLowerCase().includes(value.toLowerCase())
            );
        });
    }
}
