import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormGroupName
} from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { ActivatedRoute } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import _ from 'lodash';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';

@Component({
    selector: 'app-policy-revision-details',
    templateUrl: './policy-revision-details.component.html',
    styleUrls: ['./policy-revision-details.component.scss']
})
export class PolicyRevisionDetailsComponent implements OnInit {
    editedRisk: RiskModel;

    addedRisk: RiskModel;

    //modals
    addRiskFormModalVisible = false;
    viewRiskFormModalVisible = false;

    //policy details form
    policyRevisionDetailsForm: FormGroup;

    //endorsement form
    endorsementForm: FormGroup;

    policyData: Policy = new Policy();
    risks: RiskModel[] = [];
    displayRisks: RiskModel[];

    //selectedRisk
    selectedRisk: RiskModel;

    //Editable fields
    isEditmode = false;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private cdr: ChangeDetectorRef,
        private endorsementService: EndorsementService
    ) {}

    ngOnInit(): void {
        this.policyRevisionDetailsForm = this.formBuilder.group({
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
                this.displayRisks = this.risks;

                //set values of  fields
                this.policyRevisionDetailsForm
                    .get('client')
                    .setValue(this.policyData.client);
                this.policyRevisionDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyRevisionDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyRevisionDetailsForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.policyRevisionDetailsForm
                    .get('sumInsured')
                    .setValue(this.policyData.sumInsured);
                this.policyRevisionDetailsForm
                    .get('netPremium')
                    .setValue(this.policyData.netPremium);
                this.policyRevisionDetailsForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.policyRevisionDetailsForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.policyRevisionDetailsForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.policyRevisionDetailsForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.policyRevisionDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);
            });
        });
    }

    recieveEditedRisk($event) {
        const editedRisk: RiskModel = $event;
        this.updateRisk(editedRisk);
        this.cdr.detectChanges();
        this.risks = this.risks;
    }

    recieveAddedrisk($event) {
        const addedRisk: RiskModel[] = $event;
        this.addRisk(addedRisk);
    }

    addRisk(risks: RiskModel[]) {
        this.risks = [...this.risks, ...risks];
        console.log(this.risks);
    }

    updateRisk(risk: RiskModel) {
        console.log('saveRisk Called!');
        console.log(this.risks);
        var riskIndex = _.findIndex(this.risks, {
            riskId: risk.riskId
        });

        this.risks.splice(riskIndex, 1, risk);
    }

    openAddRiskFormModal() {
        this.addRiskFormModalVisible = true;
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
            endorsementType: 'Revision of cover',
            createdDate: new Date(),
            status: 'Not Approved'
        };

        const policy: Policy = {
            ...this.policyRevisionDetailsForm.value,
            risks: this.risks
        };

        this.endorsementService.addEndorsement(endorsement);
        this.policiesService
            .updatePolicy(policy, this.policyData.id)
            .subscribe(policy => {
                res => console.log(res);
            });
    }
}
