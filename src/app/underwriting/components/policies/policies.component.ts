import { Component, OnInit } from '@angular/core';
// import { generatePolicies } from '../../data/policy.data';
import { Router } from '@angular/router';
import { Policy } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import { UsersService } from '../../../users/services/users.service';
import { UserModel } from '../../../users/models/users.model';
import _ from 'lodash';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];
    filteredUniquePoliciesList: Policy[];
    policiesCount = 0;
    isOkLoading = false;
    user: UserModel;

    issuedBy = localStorage.getItem('user');

    searchString: string;

    constructor(
        private readonly route: Router,
        private policiesService: PoliciesService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.isOkLoading = true;
        // setTimeout(() => {
        //     this.isOkLoading = false;
        // }, 3000);
        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;

            for (const p of this.policiesList) {
                this.usersService.getUsers().subscribe(users => {
                    this.user = users.filter(x => x.ID === p.preparedBy)[0];
                });
            }

            this.policiesList.sort((a, b) =>
                a.policyNumber.localeCompare(b.policyNumber)
            );

            this.filteredUniquePoliciesList = _.uniqBy(
                this.policiesList,
                'policyNumber'
            );

            this.policiesCount = this.filteredUniquePoliciesList.length;
            this.displayPoliciesList = this.filteredUniquePoliciesList;

            this.isOkLoading = false;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.route.navigateByUrl(
            '/flosure/underwriting/policy-details/' + policy.id
        );
    }

    viewPolicyHistory(policy: Policy): void {
        this.route.navigateByUrl(
            '/flosure/underwriting/policy-history/' + policy.id
        );
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayPoliciesList = this.filteredUniquePoliciesList;
        }
        this.displayPoliciesList = this.filteredUniquePoliciesList.filter(
            policy => {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.client
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.status
                        .toLocaleLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        );
    }
}
