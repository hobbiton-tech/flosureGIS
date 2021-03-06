import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef,
    ComponentFactoryResolver
} from '@angular/core';
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
    selector: 'app-backup-policy-details',
    templateUrl: './backup-policy-details.component.html',
    styleUrls: ['./backup-policy-details.component.scss']
})
export class BackupPolicyDetailsComponent implements OnInit {
    editedRisk: RiskModel;

    addedRisk: RiskModel;

    //modals
    addRiskFormModalVisible = false;
    viewRiskFormModalVisible = false;

    //policy details form
    backupPolicyForm: FormGroup;

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
        this.backupPolicyForm = this.formBuilder.group({
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

        // this.endorsementForm = this.formBuilder.group({
        //     effectDate: ['', Validators.required],
        //     remark: ['', Validators.required]
        // });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
                this.risks = policy.risks;
                this.displayRisks = this.risks;

                this.backupPolicyForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.backupPolicyForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.backupPolicyForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.backupPolicyForm
                    .get('sumInsured')
                    .setValue(this.sumArray(this.risks, 'sumInsured'));
                this.backupPolicyForm
                    .get('netPremium')
                    .setValue(this.sumArray(this.risks, 'netPremium'));
                this.backupPolicyForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.backupPolicyForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.backupPolicyForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.backupPolicyForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.backupPolicyForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);
            });
        });
    }

    undoEndorsement() {}

    openViewRiskFormModal(risk: RiskModel) {
        this.editedRisk = risk;
        this.viewRiskFormModalVisible = true;
    }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }
}
