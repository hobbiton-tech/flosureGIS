import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PoliciesService } from '../../services/policies.service';
import { UsersService } from 'src/app/users/services/users.service';
import { Policy } from '../../models/policy.model';
import { UserModel } from 'src/app/users/models/users.model';

@Component({
    selector: 'app-policy-history',
    templateUrl: './policy-history.component.html',
    styleUrls: ['./policy-history.component.scss']
})
export class PolicyHistoryComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];
    policiesCount = 0;
    isOkLoading = false;
    user: UserModel;
    policyNumber: string;

    issuedBy = localStorage.getItem('user');

    searchString: string;

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private policiesService: PoliciesService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isOkLoading = false;
        }, 3000);

        this.route.params.subscribe(id => {
            this.policiesService.getPolicies().subscribe(policies => {
                this.policyNumber = policies.filter(
                    x => x.id == id.id
                )[0].policyNumber;

                this.policiesList = policies.filter(
                    x => x.policyNumber == this.policyNumber
                );

                this.policiesCount = this.policiesList.length;
                for (const p of this.policiesList) {
                    this.usersService.getUsers().subscribe(users => {
                        this.user = users.filter(x => x.ID === p.preparedBy)[0];
                    });
                }

                this.policiesList.sort((a, b) =>
                    a.policyNumber.localeCompare(b.policyNumber)
                );

                this.displayPoliciesList = this.policiesList;
            });
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-details/' + policy.id
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
