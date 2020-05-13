import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { ActivatedRoute } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';

@Component({
    selector: 'app-policy-cancellation-details',
    templateUrl: './policy-cancellation-details.component.html',
    styleUrls: ['./policy-cancellation-details.component.scss']
})
export class PolicyCancellationDetailsComponent implements OnInit {
    editedRisk: RiskModel;

    //policy details form
    policyCancellationDetailsForm: FormGroup;

    //endorsement form
    endorsementForm: FormGroup;

    //modals
    viewRiskFormModalVisible = false;

    policyData: Policy = new Policy();
    risks: RiskModel[] = [];

    //Editable fields
    isEditmode = false;

    isCancelledPolicy = false;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private endorsementService: EndorsementService
    ) {}

    ngOnInit(): void {
        this.policyCancellationDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            nameOfInsured: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            product: ['', Validators.required],
            sumInsured: ['', Validators.required],
            netPremium: ['', Validators.required],
            currency: ['', Validators.required],
            branch: ['', Validators.required],
            timeOfIssue: ['', Validators.required],
            dateOfIssue: ['', Validators.required],
            expiryDate: ['', Validators.required],
            quarter: ['', Validators.required],
            town: ['', Validators.required]
        });

        this.endorsementForm = this.formBuilder.group({
            effectDate: ['', Validators.required],
            endorsementRemarks: ['', Validators.required]
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
                this.risks = policy.risks;


                this.isCancelledPolicy = this.policyData.status === 'Cancelled';

                //set values of  fields
                this.policyCancellationDetailsForm
                    .get('client')
                    .setValue(this.policyData.client);
                this.policyCancellationDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyCancellationDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyCancellationDetailsForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.policyCancellationDetailsForm
                    .get('sumInsured')
                    .setValue(this.policyData.sumInsured);
                this.policyCancellationDetailsForm
                    .get('netPremium')
                    .setValue(this.policyData.netPremium);
                this.policyCancellationDetailsForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.policyCancellationDetailsForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.policyCancellationDetailsForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.policyCancellationDetailsForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.policyCancellationDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);
            });
        });
    }

    openViewRiskFormModal(risk: RiskModel) {
        this.editedRisk = risk;
        this.viewRiskFormModalVisible = true;
    }

    //endorse policy
    endorsePolicy() {
        console.log('endorse policy clicked!!');

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            endorsementType: 'Cancellation of cover',
            createdDate: new Date(),
            status: 'Not Approved'
        };

        const policy: Policy = {
            ...this.policyCancellationDetailsForm.value,
            risks: this.risks,
            status: 'Cancelled'
        };

        this.endorsementService.addEndorsement(endorsement);

        this.policiesService
            .updatePolicy(policy, this.policyData.id)
            .subscribe(policy => {
                res => console.log(res);
            });
    }
}
