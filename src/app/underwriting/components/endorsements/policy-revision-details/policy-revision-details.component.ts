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
        private premiumComputationService: PremiumComputationService
    ) {}

    ngOnInit(): void {
        this.policyRevisionDetailsIsLoading = true;
        setTimeout(() => {
            this.policyRevisionDetailsIsLoading = false;
        }, 3000);

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
            remark: ['', Validators.required]
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id['id']).subscribe(policy => {
                this.policyData = policy;
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
        this.premiumComputationService.changeRiskEditMode(true);
        this.selectedRisk = risk;
        this.viewRiskModalVisible = true;

        const vehicleDetails: VehicleDetailsModel = {
            vehicleMake: risk.vehicleMake,
            vehicleModel: risk.vehicleModel,
            yearOfManufacture: risk.yearOfManufacture,
            regNumber: risk.regNumber,
            engineNumber: risk.engineNumber,
            chassisNumber: risk.chassisNumber,
            color: risk.color,
            cubicCapacity: risk.cubicCapacity,
            seatingCapacity: risk.seatingCapacity,
            bodyType: risk.bodyType
        };

        const premiumComputationDetails: PremiumComputationDetails = {
            insuranceType: risk.insuranceType,
            productType: risk.productType,
            riskStartDate: risk.riskStartDate,
            riskEndDate: risk.riskEndDate,
            riskQuarter: risk.riskQuarter,
            numberOfDays: risk.numberOfDays,
            expiryQuarter: risk.expiryQuarter
        };

        const premimuComputations: PremiumComputation = {
            sumInsured: risk.sumInsured
        };

        const totals: ITotalsModel = {
            basicPremium: risk.basicPremium,
            premiumLevy: risk.premiumLevy,
            netPremium: risk.netPremium
        };

        this.vehicleDetailsComponent.setVehicleDetails(vehicleDetails);
        this.premiumComputationDetailsComponent.setPremiumComputationDetails(
            premiumComputationDetails
        );
        this.premuimComputationsComponent.setPremiumComputations(
            premimuComputations
        );
        this.totalsComponent.setTotals(totals);
    }

    recieveEditedRisk(risk: RiskModel) {
        this.updateRisk(risk);
    }

    recieveAddedrisk(risk) {
        console.log('risk added...lll');
        console.log(risk);
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
            remarks: '-',
            dateCreated: new Date(),
            dateUpdated: new Date()
        };

        // this.policiesService.createBackupPolicy(policy);

        this.policiesService.updatePolicy(policy).subscribe(policy => {
            res => {
                // this.policiesService.createDebitNote(
                //     policy.id,
                //     debitNote,
                //     policy
                // );
                // this.router.navigateByUrl(
                //     '/flosure/underwriting/endorsements/view-endorsements'
                // );
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
    }

    trackByRiskId(index: number, risk: RiskModel): string {
        return risk.id;
    }
}
