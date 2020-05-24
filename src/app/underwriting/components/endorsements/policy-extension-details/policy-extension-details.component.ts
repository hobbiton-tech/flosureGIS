import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { NzMessageService } from 'ng-zorro-antd';
import _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-policy-extension-details',
    templateUrl: './policy-extension-details.component.html',
    styleUrls: ['./policy-extension-details.component.scss']
})
export class PolicyExtensionDetailsComponent implements OnInit {
    editedRisk: RiskModel;

    policyEndDate: Date;

    //policy details form
    policyExtensionDetailsForm: FormGroup;

    //endorsement form
    endorsementForm: FormGroup;

    //modals
    viewRiskFormModalVisible = false;

    policyData: Policy = new Policy();
    risks: RiskModel[] = [];
    displayRisks: RiskModel[];

    //Editable fields
    isEditmode = false;

    policyRiskExtensionUpdate = new BehaviorSubject<boolean>(false);

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private msg: NzMessageService,
        private readonly router: Router,
        private policiesService: PoliciesService,
        private cdr: ChangeDetectorRef,
        private endorsementService: EndorsementService
    ) {}

    ngOnInit(): void {
        this.policyExtensionDetailsForm = this.formBuilder.group({
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
            remark: ['', Validators.required]
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
                this.risks = policy.risks;
                this.displayRisks = this.risks;

                //set values of  fields
                this.policyExtensionDetailsForm
                    .get('client')
                    .setValue(this.policyData.client);
                this.policyExtensionDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyExtensionDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyExtensionDetailsForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.policyExtensionDetailsForm
                    .get('sumInsured')
                    .setValue(this.policyData.sumInsured);
                this.policyExtensionDetailsForm
                    .get('netPremium')
                    .setValue(this.policyData.netPremium);
                this.policyExtensionDetailsForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.policyExtensionDetailsForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.policyExtensionDetailsForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.policyExtensionDetailsForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.policyExtensionDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);
            });
        });

        this.policyRiskExtensionUpdate.subscribe(update => {
            update === true ? this.updateRisksTable() : '';
        });
    }

    recieveEditedRisk(risk: RiskModel) {
        // console.log('EVENT', $event);
        // const editedRisk: RiskModel = $event;
        this.updateRisk(risk);
    }

    updateRisk(risk: RiskModel) {
        var riskIndex = _.findIndex(this.risks, {
            id: risk.id
        });

        this.risks.splice(riskIndex, 1, risk);
    }

    openViewRiskFormModal(risk: RiskModel) {
        this.editedRisk = risk;
        this.policyEndDate = this.policyExtensionDetailsForm.get(
            'endDate'
        ).value;
        this.viewRiskFormModalVisible = true;
    }

    //endorse policy
    endorsePolicy() {
        console.log('endorse policy clicked!!');

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            type: 'Extension Of Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            status: 'Pending'
        };

        const policy: Policy = {
            ...this.policyExtensionDetailsForm.value,
            id: this.policyData.id,
            risks: this.risks
        };

        this.endorsementService
            .createEndorsement(this.policyData.id, endorsement)
            .subscribe(endorsement => {
                res => console.log(res);
            });

        this.policiesService.updatePolicy(policy).subscribe(policy => {
            res => {
                console.log(res);
                // this.router.navigateByUrl(
                //     '/flosure/underwriting/endorsements/view-endorsements'
                // );
            };
            this.msg.success('Endorsement Successful');
        });
    }

    recieveUpdate($event) {
        this.policyRiskExtensionUpdate.next($event);
    }

    updateRisksTable() {
        this.risks = this.risks;
        this.displayRisks = this.risks;
    }

    trackByRiskId(index: number, risk: RiskModel): string {
        return risk.id;
    }
}
