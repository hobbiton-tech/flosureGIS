import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Policy, RiskModel } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
// import { generatePolicies } from '../../data/policy.data';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit {
    policyDetailsForm: FormGroup;

    policiesList: Policy[];
    policyNumber: string;
    policyData: Policy = new Policy();
    policy: Policy;
    displayPolicy: Policy;

    //risks
    risks: RiskModel[];

    searchString: string;
    
    

    isEditmode = false;


    showCertModal = false;
    showDebitModal = false;
    showReceiptModal = false;

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService) {}

    ngOnInit(): void {
        // this.policiesService.getPolicies().subscribe(policies => {
        //     this.policyData = policies.filter(x => x.policyNumber === this.policyNumber)[0];
        //     this.policiesList = policies;
        // });


        //get policy number from url parameter
        this.route.params.subscribe(param => {
            this.policyNumber = param.policyNumber;
            this.policiesService.getPolicies().subscribe(policies => {
                this.policyData = policies.filter(x => x.policyNumber === this.policyNumber)[0];
                this.policiesList = policies;
                this.policy = this.policiesList.filter(x => x.policyNumber === this.policyNumber)[0];
                this.displayPolicy = this.policy;
            });
        });

        //policy details form
        this.policyDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            nameOfInsured: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            product: ['', Validators.required],
            sumInsured: ['', Validators.required],
            currency: ['', Validators.required],
            timeOfIssue: ['', Validators.required],
            dateOfIssue: ['', Validators.required],
            expiryDate: ['', Validators.required],
            regNumber: ['', Validators.required],
            make: ['', Validators.required],
            type: ['', Validators.required],
            engineNumber: ['', Validators.required],
            model: ['', Validators.required],
            color: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            quater: ['', Validators.required],
            town: ['', Validators.required]
        })

        //set values of fields
        this.policiesService.getPolicies().subscribe(policies => {
            this.policyData = policies.filter(x => x.policyNumber === this.policyNumber)[0];
            this.policyDetailsForm.get('client').setValue(this.policyData.client);
            this.policyDetailsForm.get('nameOfInsured').setValue(this.policyData.nameOfInsured);
            this.policyDetailsForm.get('startDate').setValue(this.policyData.startDate);
            this.policyDetailsForm.get('endDate').setValue(this.policyData.endDate);
            this.policyDetailsForm.get('sumInsured').setValue(this.policyData.sumInsured);
            this.policyDetailsForm.get('currency').setValue(this.policyData.currency);
            this.policyDetailsForm.get('timeOfIssue').setValue(this.policyData.timeOfIssue);
            this.policyDetailsForm.get('dateOfIssue').setValue(this.policyData.dateOfIssue);
            this.policyDetailsForm.get('expiryDate').setValue(this.policyData.expiryDate);
            this.policyDetailsForm.get('quater').setValue(this.policyData.quater);
            this.policyDetailsForm.get('town').setValue(this.policyData.town);
        })
    }

    goToPoliciesList(): void {
        this.router.navigateByUrl('/flosure/underwriting/policies');
    }

    goToClientsList(): void {
        this.router.navigateByUrl('/flosure/clients/clients-list');
    }
}
