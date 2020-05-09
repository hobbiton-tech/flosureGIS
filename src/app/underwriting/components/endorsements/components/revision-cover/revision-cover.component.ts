import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';

@Component({
    selector: 'app-revision-cover',
    templateUrl: './revision-cover.component.html',
    styleUrls: ['./revision-cover.component.scss'],
})
export class RevisionCoverComponent implements OnInit {
    policiesList: Policy[];
    displayPoliciesList: Policy[];
    policiesCount: number = 0;

    searchString: string;

    constructor(
        private readonly router: Router,
        private policiesService: PoliciesService
    ) {}

    ngOnInit(): void {
        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            this.displayPoliciesList = this.policiesList;
        });
    }
  //   viewPolicyDetails(policy: Policy): void {
  //     this.route.navigateByUrl(
  //         '/flosure/underwriting/policy-details/' + policy.id
  //     );
  // }

    editDetails(policy: Policy): void{
      this.router.navigateByUrl(
        'underwriting/endorsements/edit-extension/' + policy.id
      );
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayPoliciesList = this.policiesList;
        }

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
