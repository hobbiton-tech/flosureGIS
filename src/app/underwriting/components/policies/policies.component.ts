import { Component, OnInit } from '@angular/core';
// import { generatePolicies } from '../../data/policy.data';
import { Router } from '@angular/router';
import { Policy } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
    policiesList: Policy[];
    policiesCount: number = 0;

    constructor(private readonly route: Router, private policiesService: PoliciesService) {}

    ngOnInit(): void {
        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.policiesCount = policies.length;
        })
    }

    viewPolicyDetails(policy: Policy): void {
        this.route.navigateByUrl('/flosure/underwriting/policy-details/' + policy.policyNumber);
    }
}
