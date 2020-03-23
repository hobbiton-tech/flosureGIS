import { Component, OnInit } from '@angular/core';
import { generatePolicies } from '../../data/policy.data';
import { Router } from '@angular/router';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
    policiesList = generatePolicies();
    constructor(private readonly route: Router) {}

    ngOnInit(): void {}

    viewPolicyDetails(): void {
        this.route.navigateByUrl('/flosure/underwriting/policy-details');
    }
}
