import { Component, OnInit } from '@angular/core';
// import { generatePolicies } from '../../data/policy.data';
import { Router } from '@angular/router';
import { Policy } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss'],
})
export class PoliciesComponent implements OnInit {
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
        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            this.policiesCount = policies.length;

            this.displayPoliciesList = this.policiesList;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.route.navigateByUrl(
            '/flosure/underwriting/policy-details/' + policy.id
        );
    }

    search(value: string): void {
        if (value === '' || !value) {
            // this.displayPoliciesList = this.policiesList
            this.displayPoliciesList = this.policiesList.filter((policy) => {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.client
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.preparedBy
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase())
                );
            });
        }
    }
}
