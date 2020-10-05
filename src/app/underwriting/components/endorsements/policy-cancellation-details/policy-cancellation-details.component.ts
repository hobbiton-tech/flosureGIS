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
import {
    CreditNote,
    DebitNote
} from 'src/app/underwriting/documents/models/documents.model';
import { VehicleDetailsModel } from 'src/app/quotes/models/vehicle-details.model';
import {
    PremiumComputationDetails,
    PremiumComputation
} from 'src/app/quotes/models/premium-computations.model';
import { ITotalsModel } from 'src/app/quotes/models/totals.model';
import { VehicleDetailsComponent } from 'src/app/quotes/components/vehicle-details/vehicle-details.component';
import { PremiumComputationComponent } from 'src/app/quotes/components/premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from 'src/app/quotes/components/premium-computation-details/premium-computation-details.component';
import { ExtensionsComponent } from 'src/app/quotes/components/extensions/extensions.component';
import { DiscountsComponent } from 'src/app/quotes/components/discounts/discounts.component';
import { TotalsViewComponent } from 'src/app/quotes/components/totals-view/totals-view.component';
import { VehicleDetailsServiceService } from 'src/app/quotes/services/vehicle-details-service.service';
import { PremiumComputationService } from 'src/app/quotes/services/premium-computation.service';
import { CancellationTypeOptions } from 'src/app/quotes/selection-options';
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { v4 } from 'uuid';
import { AccountService } from 'src/app/accounts/services/account.service';
import { PropertyDetailsModel } from 'src/app/quotes/models/fire-class/property-details.model';
import { PropertyDetailsComponent } from 'src/app/quotes/components/fire-class/property-details/property-details.component';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { CreateQuoteComponent } from 'src/app/quotes/components/create-quote/create-quote.component';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { TransactionModel } from '../../../../clients/models/client.model';
import { ClientsService } from '../../../../clients/services/clients.service';

@Component({
    selector: 'app-policy-cancellation-details',
    templateUrl: './policy-cancellation-details.component.html',
    styleUrls: ['./policy-cancellation-details.component.scss']
})
export class PolicyCancellationDetailsComponent implements OnInit {
    cancellationTypeOptions = CancellationTypeOptions;
    // view risk modal
    viewRiskModalVisible = false;

    // loading feedback
    policyCancellationDetailsIsLoading = false;

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

    // loading feedback
    cancellingPolicy = false;
    editedRisk: RiskModel;
    selectedRisk: RiskModel;

    // policy details form
    policyCancellationDetailsForm: FormGroup;

    // cancellation type form
    policyCancellationTypeForm: FormGroup;

    // cancellation type
    selectedCancellationType = { label: 'Time On Risk', value: 'timeOnRisk' };

    // endorsement form
    endorsementForm: FormGroup;

    // modals
    viewRiskFormModalVisible = false;

    policyData: Policy = new Policy();
    policyNumber: string;
    risks: RiskModel[] = [];
    risksLoading = true;

    // Editable fields
    isEditmode = false;

    // creditNote
    creditNotes: CreditNote[];

    // policy debit note
    debitNote: DebitNote;

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

    // Credit Note PDF
    isCreditNotePDFVisible = false;
    isCancelledPolicy = false;
    transaction: any;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private msg: NzMessageService,
        private readonly router: Router,
        private endorsementService: EndorsementService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private propertyDetailsComponent: PropertyDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private premiumComputationService: PremiumComputationService,
        private accountsService: AccountService,
        private readonly quoteService: QuotesService,
        private createQuoteComponent: CreateQuoteComponent,
        private classHandler: InsuranceClassHandlerService,
        private  clientsService: ClientsService,
    ) {}

    ngOnInit(): void {
        this.policyCancellationDetailsIsLoading = true;
        // setTimeout(() => {
        //     this.policyCancellationDetailsIsLoading = false;
        // }, 3000);

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

        this.policyCancellationTypeForm = this.formBuilder.group({
            selectedCancellationType: [''],
            premium: ['', Validators.required]
        });

        this.endorsementForm = this.formBuilder.group({
            effectDate: ['', Validators.required],
            remark: ['', Validators.required]
        });

        this.policiesService.getCreditNotes().subscribe(creditNotes => {
            this.creditNotes = creditNotes;
        });

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id.id).subscribe(policy => {
                this.policyData = policy;
                this.classHandler.changeSelectedClass(this.policyData.class);
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

                // debit note
                this.policiesService.getDebitNotes().subscribe(debitNotes => {
                    this.debitNote = debitNotes.filter(
                        debitNotePolicy =>
                            debitNotePolicy.policy.id == this.policyData.id
                    )[0];
                });

                this.isCancelledPolicy = this.policyData.status === 'Cancelled';

                // set values of  fields
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

                this.policyCancellationDetailsIsLoading = false;
            });
        });
    }

    openViewRiskFormModal(risk: RiskModel) {
        this.editedRisk = risk;
        this.viewRiskFormModalVisible = true;
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.premiumComputationService.changeRiskEditMode(true);
        this.premiumComputationService.changeExtensionMode(false);
        this.selectedRisk = risk;

        this.createQuoteComponent.viewRiskDetails(risk);

        this.viewRiskModalVisible = true;
    }

    handleCreditNotePremium() {
        if (
            this.policyCancellationTypeForm.get('selectedCancellationType')
                .value == 'timeOnRisk'
        ) {
            console.log('here');
            const premium = this.policyCancellationBalance();
            this.policyCancellationTypeForm
                .get('premium')
                .setValue(premium.toFixed(2));
        } else if (
            this.policyCancellationTypeForm.get('selectedCancellationType')
                .value == 'fullRefund'
        ) {
            this.policyCancellationTypeForm
                .get('premium')
                .setValue(this.policyData.netPremium);
        }
    }

    // calculate number of days between two dates and returns requisition amount
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

    // endorse policy
    endorsePolicy() {
        this.cancellingPolicy = true;

        const endorsement: Endorsement = {
            ...this.endorsementForm.value,
            type: 'Cancellation_Of_Cover',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            id: this.policyData.id,
            status: 'Pending'
        };

        const policy: Policy = {
            ...this.policyCancellationDetailsForm.value,
            ...this.policyData,
            id: v4(),
            risks: this.risks,
            status: 'Cancelled'
        };

        const creditNote: CreditNote = {
            remarks: this.endorsementForm.get('remark').value,
            status: 'Pending',
            dateCreated: new Date(),
            dateUpdated: new Date(),
            creditNoteAmount: this.creditNoteAmount = this.policyCancellationTypeForm.get(
                'premium'
            ).value
        };

        const requisition: IRequisitionModel = {
            id: v4(),
            policyNumber: this.policyData.id,
            requisitionNumber: 'REQ-000000',
            payee: this.policyData.client,
            cancellationDate: new Date(),
            dateCreated: new Date(),
            approvalStatus: 'Pending',
            paymentType: 'PYMT',
            currency: this.policyData.currency,
            amount: this.creditNoteAmount = this.policyCancellationTypeForm.get(
                'premium'
            ).value,
            creditNote
        };

        this.policiesService.updatePolicy(policy).subscribe(policy => {
            console.log(policy);
            this.endorsementService
                .createEndorsement(this.policyData.id, endorsement)
                .subscribe(endorsement => {
                    console.log(endorsement);
                });

            this.policiesService.createCreditNote(
                this.policyData.id,
                creditNote,
                this.policyData,
                this.debitNote.debitNoteNumber,
                requisition
            ).subscribe(
              async res => {
                console.log('credit note', res);

                this.clientsService.getTransactions().subscribe((txns: any) => {
                  let balanceTxn = 0;
                  console.log('DEDEDE', txns);
                  const filterTxn = txns.data.filter((x) => x.client_id === this.policyData.clientCode);

                  if (filterTxn === null || filterTxn === undefined || filterTxn === [] || filterTxn.length === 0) {
                    balanceTxn = Number(res.creditNoteAmount) * -1;
                  } else {
                    this.transaction = filterTxn.slice(-1)[0];

                    console.log('DEDEDE', this.transaction);

                    balanceTxn = Number(this.transaction.balance) + Number(res.creditNoteAmount * -1);
                  }


                  const trans: TransactionModel = {
                    open_cash: 0,
                    balance: Number(balanceTxn),
                    client_id: this.policyData.clientCode,
                    cr: Number(res.creditNoteAmount * -1),
                    credit_note_id: res.id,
                    dr: 0,
                    transaction_amount: Number(res.creditNoteAmount * -1),
                    transaction_date: new Date(),
                    type: 'Cancellation',
                    reference: res.creditNoteNumber
                  };

                  this.clientsService.createTransaction(trans).subscribe((sucTxn) => {}, (errTxn) => {
                    console.log(errTxn);
                  });
                });

                this.accountsService
                  .createRequisition(requisition)
                  .subscribe((req) => console.log('requisition', res));
              },
              async err => {
                console.log(err);
              });
            this.router.navigateByUrl(
                '/flosure/underwriting/endorsements/cancellation-cover'
            );
            this.msg.success('Cancellation Successful');
            this.cancellingPolicy = false;
        });

        this.creditNoteAmount = this.policyCancellationTypeForm.get(
            'premium'
        ).value;
    }
}
