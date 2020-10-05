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
import { ActivatedRoute, Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import _ from 'lodash';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import { VehicleDetailsComponent } from 'src/app/quotes/components/vehicle-details/vehicle-details.component';
import { PremiumComputationComponent } from 'src/app/quotes/components/premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from 'src/app/quotes/components/premium-computation-details/premium-computation-details.component';
import { ExtensionsComponent } from 'src/app/quotes/components/extensions/extensions.component';
import { DiscountsComponent } from 'src/app/quotes/components/discounts/discounts.component';
import { TotalsViewComponent } from 'src/app/quotes/components/totals-view/totals-view.component';
import { VehicleDetailsServiceService } from 'src/app/quotes/services/vehicle-details-service.service';
import { VehicleDetailsModel } from 'src/app/quotes/models/vehicle-details.model';
import {
    PremiumComputationDetails,
    PremiumComputation
} from 'src/app/quotes/models/premium-computations.model';
import { ITotalsModel } from 'src/app/quotes/models/totals.model';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';
import { PropertyDetailsModel } from 'src/app/quotes/models/fire-class/property-details.model';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { PropertyDetailsComponent } from 'src/app/quotes/components/fire-class/property-details/property-details.component';
import { CreateQuoteComponent } from 'src/app/quotes/components/create-quote/create-quote.component';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { HttpClient } from '@angular/common/http';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';

@Component({
    selector: 'app-policy-revision-details',
    templateUrl: './policy-revision-details.component.html',
    styleUrls: ['./policy-revision-details.component.scss']
})
export class PolicyRevisionDetailsComponent implements OnInit {
    // view risk modal
    viewRiskModalVisible = false;

    // loading feedback
    policyRevisionDetailsIsLoading = false;

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

    //loading feedback
    updatingPolicy: boolean = false;

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

    //assigned risks to update table
    assignedRisks: RiskModel[];

    //Editable fields
    isEditmode = false;
    _risks: RiskModel[];

    // premium before any endorsements
    currentPremium: number = 0;

    // dynamic premium
    newPremium: number = 0;

    // debit note amount
    debitNoteAmount: number = 0;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private cdr: ChangeDetectorRef,
        private msg: NzMessageService,
        private readonly router: Router,
        private endorsementService: EndorsementService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private premiumComputationService: PremiumComputationService,
        private readonly quoteService: QuotesService,
        private propertyDetailsComponent: PropertyDetailsComponent,
        private createQuoteComponent: CreateQuoteComponent,
        private classHandler: InsuranceClassHandlerService,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        this.policyRevisionDetailsIsLoading = true;
        setTimeout(() => {
            this.policyRevisionDetailsIsLoading = false;
        }, 3000);

        this.policyRevisionDetailsForm = this.formBuilder.group({
            client: ['', Validators.required],
            nameOfInsured: ['', Validators.required],
            startDate: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            endDate: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            product: ['', Validators.required],
            sumInsured: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            netPremium: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            currency: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            branch: ['', Validators.required],
            timeOfIssue: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            dateOfIssue: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            expiryDate: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            quarter: [
                { value: '', disabled: !this.isEditmode },
                Validators.required
            ],
            town: ['', Validators.required]
        });

        this.endorsementForm = this.formBuilder.group({
            effectDate: ['', Validators.required],
            remark: ['', Validators.required]
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
                this.currentPremium = this.policyData.netPremium;
                this.classHandler.changeSelectedClass(this.policyData.class);
                this.risks = policy.risks;
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

        this.policyRiskRevisionUpdate.subscribe(update => {
            update === true ? this.updateRisksTable() : '';
        });
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.viewRiskModalVisible = true;

        this.premiumComputationService.changeRiskEditMode(true);
        this.selectedRisk = risk;

        this.createQuoteComponent.viewRiskDetails(risk);
    }

    recieveEditedRisk(risk: RiskModel) {
        this.updateRisk(risk);
    }

    recieveAddedrisk(risk) {
        const addedRisk: RiskModel = risk;
        this.addRisk(addedRisk);
    }

    // remove risk from risks table
    removeRisk(id: string): void {
        this.risks = this.risks.filter(risk => risk.id !== id);
        this.displayRisks = this.risks;
        this.updatePolicy();
    }

    addRisk(risk: RiskModel) {
        this.risks.push(risk);
        this.risks = this.risks;
        this.displayRisks = this.risks;
        this.updatePolicy();
    }

    updatePolicy() {
        this.policyRevisionDetailsForm
            .get('netPremium')
            .setValue(this.sumArray(this.risks, 'netPremium'));
    }

    updateRisk(risk: RiskModel) {
        var riskIndex = _.findIndex(this.risks, {
            id: risk.id
        });

        this.risks.splice(riskIndex, 1, risk);
    }

    openAddRiskFormModal() {
        this.addRiskFormModalVisible = true;
        this.premiumComputationService.changeRiskEditMode(false);
    }

    openViewRiskFormModal(risk: RiskModel) {
        this.editedRisk = risk;
        this.viewRiskFormModalVisible = true;
    }

    //endorse policy
    endorsePolicy() {
        this.updatingPolicy = true;

        const currentClassObj: IClass = JSON.parse(
            localStorage.getItem('classObject')
        );

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            type: 'Revision_Of_Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            status: 'Pending'
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
            risks: this.risks
        };

        this.endorsementService
            .createEndorsement(this.policyData.id, endorsement)
            .subscribe(endorsement => {
                res => console.log(res);
            });

        const debitNote: DebitNote = {
            remarks: 'Policy Revision',
            status: 'Pending',
            debitNoteAmount: this.debitNoteAmount,
            dateCreated: new Date(),
            dateUpdated: new Date()
        };

        // this.policiesService.createBackupPolicy(policy);

        this.policiesService.createPolicy(policy).subscribe(policy => {
            res => {
                this.http
                    .get<any>(
                        `https://number-generation.flosure-api.com/savenda-invoice-number/1/${currentClassObj.classCode}`
                    )
                    .subscribe(async resd => {
                        debitNote.debitNoteNumber = resd.data.invoice_number;

                        this.http
                            .post<DebitNote>(
                                `https://savenda.flosure-api.com/documents/debit-note/${this.policyData.id}`,
                                debitNote
                            )
                            .subscribe(
                                async resh => {
                                    console.log(resh);
                                },
                                async err => {
                                    console.log(err);
                                }
                            );
                    });
            };

            this.msg.success('Endorsement Successful');
            this.updatingPolicy = false;
        });
    }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    recieveUpdate($event) {
        this.policyRiskRevisionUpdate.next($event);
    }

    updateRisksTable() {
        this.risks = this.risks;
        this.displayRisks = this.risks;

        this.newPremium = this.sumArray(this.risks, 'netPremium');
        this.calculateDebitNoteAmount();
    }

    calculateDebitNoteAmount() {
        this.debitNoteAmount = this.newPremium - this.currentPremium;
    }

    trackByRiskId(index: number, risk: RiskModel): string {
        return risk.id;
    }
}
