import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd';

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
    policyNumber: string;
    risks: RiskModel[] = [];
    risksLoading = true;

    //Editable fields
    isEditmode = false;

    // For Modal
    clientName: string;
    clientNumber: string;
    clientEmail: string;
    policyRisk: RiskModel;
    issueDate: string;
    issueTime: string;
    agency: string;
    classOfBusiness: string;
    coverForm: string;
    coverTo: string;
    basicPremium: string;
    loadingAmount: string;
    discountAmount: string;
    totalAmount: string;
    creditNoteAmount: number;

    //Credit Note PDF
    isCreditNotePDFVisible = false;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private msg: NzMessageService,
        private readonly router: Router,
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
            remark: ['', Validators.required]
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
                this.risks = policy.risks;

                this.policyRisk = policy.risks[0];
                this.clientName = policy.client;
                this.clientNumber = '+260976748392';
                this.clientEmail = policy.client + '@gmail.com'; // TODO: Track client data
                this.agency = 'Direct'; // TODO: Track this guy too
                this.coverForm = policy.startDate.toString();
                this.coverTo = policy.endDate.toString();
                // this.basicPremium = this.policy
                this.loadingAmount = '-';
                this.discountAmount = '-';
                this.totalAmount = policy.netPremium.toString();
                this.issueDate = policy.dateOfIssue.toString();
                this.issueTime = policy.dateOfIssue.toString();

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

    //calculate number of days between two dates and returns requisition amount
    policyCancellationBalance(): number {
        const todayDate = new Date();
        const policyEndDate = this.policyData.endDate;

        const start = moment(todayDate);
        const end = moment(policyEndDate);

        const differenceInDays = end.diff(start, 'days');
        const requisitionAmount =
            Number(this.policyData.netPremium) -
            (differenceInDays / 365) * Number(this.policyData.netPremium);

        this.creditNoteAmount = requisitionAmount;

        return requisitionAmount;
    }

    //endorse policy
    endorsePolicy() {
        console.log('endorse policy clicked!!');

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            type: 'Cancellation Of Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            id: this.policyData.id,
            status: 'Pending'
        };

        const policy: Policy = {
            ...this.policyCancellationDetailsForm.value,
            risks: this.risks,
            status: 'Cancelled'
        };

        this.endorsementService.createEndorsement(
            this.policyData.id,
            endorsement
        );

        this.policiesService.updatePolicy(policy);

        this.creditNoteAmount = this.policyCancellationBalance();

        this.msg.success('Cancellation Successful');
        this.router.navigateByUrl(
            '/flosure/underwriting/endorsements/view-endorsements'
        );
    }
}
