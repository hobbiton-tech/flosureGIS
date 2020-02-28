import { Component, OnInit } from '@angular/core';
import { generatePolicies } from '../../data/policy.data';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
    policiesList = generatePolicies();
    constructor() {}

    ngOnInit(): void {}
}
