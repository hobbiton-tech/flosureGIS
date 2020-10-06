import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Endorsement } from 'src/app/underwriting/models/endorsement.model';
import { EndorsementService } from 'src/app/underwriting/services/endorsements.service';
import { NzMessageService } from 'ng-zorro-antd';
import _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
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
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';

@Component({
    selector: 'app-policy-extension-details',
    templateUrl: './policy-extension-details.component.html',
    styleUrls: ['./policy-extension-details.component.scss']
})
export class PolicyExtensionDetailsComponent implements OnInit, OnDestroy {
    riskStartDateSubcription: Subscription;
    riskEndDateSubscription: Subscription;
    numberOfDaysSubscription: Subscription;
    netPremiumSubscription: Subscription;

    // view risk modal
    viewRiskModalVisible = false;

    // loading feedback
    policyExtensionDetailsIsLoading = false;

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

    //loading feedback
    updatingPolicy: boolean = false;

    // is extended premium
    isExtendedPremium: boolean = false;

    editedRisk: RiskModel;

    selectedRisk: RiskModel;

    policyEndDate: Date;

    riskEndDate: Date;

    numberOfDays: number;

    extendedBasicPremium: number;

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

    // premium before any endorsements
    currentPremium: number = 0;

    // dynamic premium
    newPremium: number = 0;

    // debit note amount
    debitNoteAmount: number = 0;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private msg: NzMessageService,
        private readonly router: Router,
        private policiesService: PoliciesService,
        private cdr: ChangeDetectorRef,
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
    ) {
        // this.numberOfDaysSubscription = this.premiumComputationService.numberOfDaysChanged$.subscribe(
        //     numberOfDays => {
        //         console.log('nod:', numberOfDays);
        //         this.numberOfDays = numberOfDays;
        //         this.changeBasicPremium(numberOfDays);
        //     }
        // );
        // this.riskEndDateSubscription = this.premiumComputationService.riskEndDateChanged$.subscribe(
        //     riskEndDate => {
        //         this.riskEndDate = riskEndDate;
        //     }
        // );
        this.netPremiumSubscription = this.premiumComputationService.netPremiumChanged$.subscribe(
            netPremium => {
                this.newPremium = netPremium;
                this.calculateDebitNoteAmount();
            }
        );
    }

    ngOnInit(): void {
        this.policyExtensionDetailsIsLoading = true;
        // setTimeout(() => {
        //     this.policyExtensionDetailsIsLoading = false;
        // }, 3000);

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
                this.currentPremium = this.policyData.netPremium;
                this.classHandler.changeSelectedClass(this.policyData.class);

                console.log('policy class:=> ', this.policyData.class);
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

                this.policyExtensionDetailsIsLoading = false;
            });
        });

        this.policyRiskExtensionUpdate.subscribe(update => {
            update === true ? this.updateRisksTable() : '';
        });
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        const currentRiskEndDate: Date = risk.riskEndDate;
        this.premiumComputationService.changeRiskEditMode(true);
        this.premiumComputationService.changeExtensionMode(true);

        this.createQuoteComponent.viewRiskDetails(risk);
        this.viewRiskModalVisible = true;
    }

    recieveEditedRisk(risk: RiskModel) {
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
        this.updatingPolicy = true;
        console.log('endorse policy clicked!!');

        // TODO: generate endorsement numbers from api
        const endorsementNumber = this.endorsementService.generateEndorsementID(
            this.policyData.endorsements.length
        );

        console.log('ENDORSMENT NUMBER:=> ', endorsementNumber);

        const currentClassObj: IClass = JSON.parse(
            localStorage.getItem('classObject')
        );

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            endorsementNumber: endorsementNumber,
            type: 'Extension_Of_Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            status: 'Pending'
        };

        const policy: Policy = {
            ...this.policyExtensionDetailsForm.value,
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
            sourceOfBusiness: this.policyData.sourceOfBusiness,
            risks: this.risks,
            sumInsured: this.sumArray(this.risks, 'sumInsured'),
            netPremium: this.sumArray(this.risks, 'netPremium'),
            term: this.policyData.term,
            id: v4()
        };

        const debitNote: DebitNote = {
            remarks: 'Policy Extension',
            status: 'Pending',
            debitNoteAmount: this.debitNoteAmount,
            dateCreated: new Date(),
            dateUpdated: new Date()
        };

        this.policiesService.createPolicy(policy).subscribe(policy => {
            console.log(policy);

            this.endorsementService
                .createEndorsement(this.policyData.id, endorsement)
                .subscribe(endorsement => {
                    console.log(endorsement);
                });

            this.http
                .get<any>(
                    `https://number-generation.flosure-api.com/savenda-invoice-number/1/${currentClassObj.classCode}`
                )
                .subscribe(async resd => {
                    debitNote.debitNoteNumber = resd.data.invoice_number;

                    this.http
                        .post<DebitNote>(
                            `https://flosure-postgres-db.herokuapp.com/documents/debit-note/${policy.id}`,
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

            this.msg.success('Endorsement Successful');
            this.router.navigateByUrl(
                '/flosure/underwriting/endorsements/extension-cover'
            );
            this.updatingPolicy = false;

        });
    }

    recieveUpdate($event) {
        this.policyRiskExtensionUpdate.next($event);
    }

    updateRisksTable() {
        this.risks = this.risks;
        this.displayRisks = this.risks;

        this.newPremium = this.sumArray(this.risks, 'netPremium');
        this.policyExtensionDetailsForm
            .get('netPremium')
            .setValue(this.sumArray(this.risks, 'netPremium'));
        this.policyExtensionDetailsForm
            .get('sumInsured')
            .setValue(this.sumArray(this.risks, 'sumInsured'));
        this.calculateDebitNoteAmount();
    }

    trackByRiskId(index: number, risk: RiskModel): string {
        return risk.id;
    }

    changeBasicPremium(numberOfDays: number) {
        // this.premiumComputationService.changeExtendedPremium(numberOfDays);
    }

    calculateDebitNoteAmount() {
        this.debitNoteAmount = this.newPremium - this.currentPremium;
    }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    ngOnDestroy() {
        // this.riskEndDateSubscription.unsubscribe();
        // this.numberOfDaysSubscription.unsubscribe();
        this.netPremiumSubscription.unsubscribe();
    }
}
