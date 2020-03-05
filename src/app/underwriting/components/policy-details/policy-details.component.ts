import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { generatePolicies } from '../../data/policy.data';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit {

  selectedPolicy = generatePolicies()[8];
  isEditmode = false;
   
  constructor(private readonly router: Router) { }

  ngOnInit(): void {
  }

  goToPoliciesList(): void {
    this.router.navigateByUrl('/underwriting/policies');
  }

}
