import {
    Component,
    OnInit,
    Input,
    ChangeDetectorRef,
    ComponentFactoryResolver,
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormGroupName,
} from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import _ from 'lodash';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-policy-revision-details',
    templateUrl: './policy-revision-details.component.html',
    styleUrls: ['./policy-revision-details.component.scss'],
})
export class PolicyRevisionDetailsComponent implements OnInit {
    editedRisk: RiskModel;

    addedRisk: RiskModel;

    //modals
    addRiskFormModalVisible = false;
    viewRiskFormModalVisible = false;

    policyRiskRevisionUpdate = new BehaviorSubject<boolean>(false);

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
    _risks: RiskModel[];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private cdr: ChangeDetectorRef,
        private msg: NzMessageService,
        private readonly router: Router,
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
            town: ['', Validators.required],
        });

        this.endorsementForm = this.formBuilder.group({
            effectDate: ['', Validators.required],
            remark: ['', Validators.required],
        });

        this.route.params.subscribe((id) => {
            this.policiesService.getPolicyById(id['id']).subscribe((policy) => {
                this.policyData = policy;
                this.risks = policy.risks;
                // this._risks = this.risks;
                this.displayRisks = this.risks;

                //set values of  fields
                // this.policyRevisionDetailsForm
                //     .get('client')
                //     .setValue(this.policyData.client);
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
                    .setValue(this.sumArray(this.risks, 'sumInsured'));
                this.policyRevisionDetailsForm
                    .get('netPremium')
                    .setValue(this.sumArray(this.risks, 'netPremium'));
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

        this.policyRiskRevisionUpdate.subscribe((update) => {
            update === true
                ? this.route.params.subscribe((id) => {
                      this.policiesService
                          .getBackupPolicyById(id['id'])
                          .subscribe((policy) => {
                              console.log(this.risks);
                          });
                  })
                : '';
        });
    }

    recieveEditedRisk($event) {
        console.log('EVENT', $event);
        console.log(this.risks);
        const editedRisk: RiskModel = $event;
        this.policyRiskRevisionUpdate.next(true);
        this.updateRisk(editedRisk);
        this.cdr.detectChanges();
    }

    recieveAddedrisk($event) {
        const addedRisk: RiskModel[] = $event;
        this.addRisk(addedRisk);
    }

    // remove risk from risks table
    removeRisk(regNumber: string): void {
        this.risks = this.risks.filter((risk) => risk.regNumber !== regNumber);
    }

    addRisk(risks: RiskModel[]) {
        this.risks = [...this.risks, ...risks];
    }

    updateRisk(risk: RiskModel) {
        var riskIndex = _.findIndex(this.risks, {
            riskId: risk.riskId,
        });

        this.risks.splice(riskIndex, 1, risk);
        this.policyRiskRevisionUpdate.next(true);
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
            type: 'Revision Of Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            status: 'Pending',
        };

        const policy: Policy = {
            ...this.policyRevisionDetailsForm.value,
            policyNumber: this.policyData.policyNumber,
            product: this.policyData.product,
            client: this.policyData.client,
            clientCode: this.policyData.clientCode,
            branch: this.policyData.branch,
            insuranceCompany: this.policyData.insuranceCompany,
            preparedBy: this.policyData.preparedBy,
            status: this.policyData.status,
            user: this.policyData.user,
            town: this.policyData.town,
            productType: this.policyData.productType,
            underwritingYear: this.policyData.underwritingYear,
            receiptStatus: this.policyData.receiptStatus,
            paymentPlan: this.policyData.paymentPlan,
            id: this.policyData.id,
            risks: this.risks,
        };

        console.log('policy details form values:');
        console.log(this.policyRevisionDetailsForm.value);

        console.log('risks:');
        console.log(this.risks);

        this.endorsementService
            .createEndorsement(this.policyData.id, endorsement)
            .subscribe((endorsement) => {
                (res) => console.log(res);
            });

        // this.policiesService.createBackupPolicy(policy);
        this.policiesService.updatePolicy(policy).subscribe((policy) => {
            (res) => console.log(res);
        });

        this.msg.success('Endorsement Successful');
        // this.router.navigateByUrl(
        //     '/flosure/underwriting/endorsements/view-endorsements'
        // );
    }

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }

    recieveUpdate($event) {
        this.policyRiskRevisionUpdate.next($event);
    }
}
