import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../../../users/models/roles.model';
import { UserModel } from '../../../../../users/models/users.model';
import { CommisionSetupsService } from '../../../../../settings/components/agents/services/commision-setups.service';
import { UsersService } from '../../../../../users/services/users.service';
import _ from 'lodash';

@Component({
    selector: 'app-revision-cover',
    templateUrl: './revision-cover.component.html',
    styleUrls: ['./revision-cover.component.scss']
})
export class RevisionCoverComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];
    filteredUniquePoliciesList: Policy[];
    policiesCount: number = 0;

    revisionOfCoverListIsLoading = false;

    searchString: string;
    decodedJwtData: any;

    permission: PermissionsModel;
    user: UserModel;
    isPresent: PermissionsModel;
    admin = 'admin';
    editPolicy = 'edit_policy';
    loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly router: Router,
        private policiesService: PoliciesService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.revisionOfCoverListIsLoading = true;
        // setTimeout(() => {
        //     this.revisionOfCoverListIsLoading = false;
        // }, 3000);

        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

            this.isPresent = this.user.Permission.find(
                el => el.name === this.admin || el.name === this.editPolicy
            );

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
        });

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.filteredUniquePoliciesList = _.uniqBy(
                this.policiesList,
                'policyNumber'
            );
            this.displayPoliciesList = this.filteredUniquePoliciesList;

            this.revisionOfCoverListIsLoading = false;
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-revision-details/' + policy.id
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
                    policy.client.toLowerCase().includes(value.toLowerCase())
                );
            }
        );
    }
}
