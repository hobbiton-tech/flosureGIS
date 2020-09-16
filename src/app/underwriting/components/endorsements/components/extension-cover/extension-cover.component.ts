import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../../../users/models/roles.model';
import { UserModel } from '../../../../../users/models/users.model';
import { UsersService } from '../../../../../users/services/users.service';

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
  permission: PermissionsModel;
  user: UserModel;
  isPresent: PermissionsModel;
  admin = 'admin';
  viewPolicy = 'view_policy';
  loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly router: Router,
        private readonly policiesService: PoliciesService,
        private  usersService: UsersService,
    ) {}

    ngOnInit(): void {
        this.extensionOfCoverListIsLoading = true;
        setTimeout(() => {
            this.extensionOfCoverListIsLoading = false;
        }, 3000);

      const decodedJwtData = jwt_decode(this.loggedIn);
      console.log('Decoded>>>>>>', decodedJwtData);

      this.usersService.getUsers().subscribe((users) => {
        this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

        this.isPresent = this.user.Permission.find((el) => el.name === this.admin || el.name === this.viewPolicy);

        console.log('USERS>>>', this.user, this.isPresent, this.admin);
      });

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
