import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from '../../models/policy.model';
import {
    RiskModel,
    DiscountType,
    LoadModel,
    DiscountModel
} from 'src/app/quotes/models/quote.model';
import { Router, ActivatedRoute } from '@angular/router';
import { PoliciesService } from '../../services/policies.service';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { AccountService } from 'src/app/accounts/services/account.service';
import { ITimestamp } from 'src/app/settings/components/insurance-companies/models/insurance-company.model';
import {
    InstallmentsModel,
    IPaymentModel,
    PlanReceipt
} from 'src/app/accounts/components/models/payment-plans.model';
import { v4 } from 'uuid';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { IDebitNoteDTO } from 'src/app/quotes/models/debit-note.dto';
import { ICertificateDTO } from 'src/app/quotes/models/certificate.dto';
import { Endorsement } from '../../models/endorsement.model';
import { EndorsementService } from '../../services/endorsements.service';
import { IDiscounts } from 'src/app/quotes/models/discounts.model';
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
import * as jwt_decode from 'jwt-decode';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';

type AOA = any[][];

interface IRateResult {
    sumInsured: string;
    endDate: string;
    quarter: string;
    totalPremium: string;
    riotAndStrikePremium: string;
    basicPremium: string;
    thirdPartyLoadingPremium: string;
    carStereoPremium: string;
    lossOfUsePremium: string;
    territorialExtensionPremium: string;
    discount: string;
}

interface IRateRequest {
    sumInsured: number;
    premiumRate: number;
    startDate: Date;
    quarter: number;
    appliedDiscount: number;
    discount: number;
    carStereo: number;
    carStereoRate: number;
    lossOfUseDays: number;
    lossOfUseRate: number;
    territorialExtensionWeeks: number;
    territorialExtensionCountries: number;
    thirdPartyLimit: number;
    thirdPartyLimitRate: number;
    riotAndStrike: number;
    levy: number;
}

@Component({
    selector: 'app-policy-renewals-details',
    templateUrl: './policy-renewals-details.component.html',
    styleUrls: ['./policy-renewals-details.component.scss']
})
export class PolicyRenewalsDetailsComponent implements OnInit {
    // view risk modal
    viewRiskModalVisible = false;

    // loading feedback
    policyRenewalDetailsIsLoading = false;

    // modals
    addRiskFormModalVisible = false;
    viewRiskFormModalVisible = false;

    isVisible = false;
    policyDetailsForm: FormGroup;
    paymentPlanForm: FormGroup;
    premiumComputationForm: FormGroup;
    policydata: Policy[] = [];

    loadingPolicy = false;

    policiesList: Policy[];
    policyNumber: string;
    policyData: Policy = new Policy();
    policy: Policy;
    displayPolicy: Policy;
    policyUpdate: Policy = new Policy();
    isLoading = false;

    // endorsement form
    endorsementForm: FormGroup;

    paymentPlan = 'NotCreated';
    // risk details modal
    riskDetailsModalVisible = false;
    isPlanVisible = false;

    status = 'Unreceipted';

    // risks
    risks: RiskModel[] = [];
    displayRisks: RiskModel[];
    risksLoading = true;

    searchString: string;

    isEditmode = false;


    territorialExtensionCountries: number;


    // selected risk in risk table
    selectedRisk: RiskModel;

    // PDFS
    isCertificatePDFVisible = false;
    isDebitNotePDFVisible = false;
    isSchedulePDFVisible = false;
    isClausesPDFVisible = false;
    // close add risk panel
    isAddRiskPanelOpen: boolean;

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    // For Modal
    clientName: string;
    clientNumber: string;
    clientEmail: string;
    policyRisk: RiskModel;
    issueDate: string;
    issueTime: string;
    agency: string;
    classOfBusiness: string;
    coverForm: any;
    coverTo: string;
    basicPremium: any;
    loadingAmount: string;
    discountAmount: string;
    totalAmount: string;

    policyRenewalUpdates = new BehaviorSubject<boolean>(false);

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' }
    ];

    selectedPlanValue = 'fully';
    formattedDate: any;
    planId: string;
    // clientName: any;
    netPremium: number;
    formattedeDate: Date;
    _id: string;

    // dicounts added
    discounts: IDiscounts[] = [];
    policyID: string;

  permission: PermissionsModel;
  user: UserModel;
  isPresent: PermissionsModel;
  admin = 'admin';
  renewPolicyPem = 'renew_policy';
  loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private msg: NzMessageService,
        private http: HttpClient,
        private quotesService: QuotesService,
        private readonly clientsService: ClientsService,
        private readonly agentsService: AgentsService,
        private endorsementService: EndorsementService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private  usersService: UsersService,
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.policyRenewalDetailsIsLoading = true;
        setTimeout(() => {
            this.policyRenewalDetailsIsLoading = false;
        }, 3000);

        this.route.params.subscribe(id => {

          const decodedJwtData = jwt_decode(this.loggedIn);
          console.log('Decoded>>>>>>', decodedJwtData);

          this.usersService.getUsers().subscribe((users) => {
            this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];

            this.isPresent = this.user.Permission.find((el) => el.name === this.admin || el.name === this.renewPolicyPem);

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
          });
            this.policiesService.getPolicyById(id.id).subscribe(policy => {
                this.policyData = policy;

                this.policyID = this.policyData.id;
                this.policyNumber = this.policyData.policyNumber;

                this.risks = policy.risks;

                this.displayRisks = this.risks;

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

                // set values of fields
                // this.policyDetailsForm
                //     .get('client')
                //     .setValue(this.policyData.client);
                this.policyDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyDetailsForm
                    .get('endDate')
                    .setValue(this.policyData.endDate);
                this.policyDetailsForm
                    .get('sumInsured')
                    .setValue(this.policyData.sumInsured);
                this.policyDetailsForm
                    .get('netPremium')
                    .setValue(this.policyData.netPremium);
                this.policyDetailsForm
                    .get('currency')
                    .setValue(this.policyData.currency);
                this.policyDetailsForm
                    .get('timeOfIssue')
                    .setValue(this.policyData.timeOfIssue);
                this.policyDetailsForm
                    .get('dateOfIssue')
                    .setValue(this.policyData.dateOfIssue);
                this.policyDetailsForm
                    .get('expiryDate')
                    .setValue(this.policyData.endDate);
                this.policyDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);
                this.policyDetailsForm
                    .get('remarks')
                    .setValue(this.policyData.remarks);

                this.risksLoading = false;
            });

            this.policyRenewalUpdates.subscribe(update => {
                update === true ? this.updateRisksTable() : '';
            });

            this.endorsementForm = this.formBuilder.group({
                effectDate: ['', Validators.required],
                remark: ['', Validators.required]
            });
        });

        // policy details form
        this.policyDetailsForm = this.formBuilder.group({
            // client: ['', Validators.required],
            nameOfInsured: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [''],
            product: [''],
            sumInsured: ['', Validators.required],
            netPremium: [''],
            currency: ['', Validators.required],
            branch: [''],
            timeOfIssue: ['', Validators.required],
            dateOfIssue: ['', Validators.required],
            expiryDate: ['', Validators.required],
            quarter: ['', Validators.required],
            town: [''],
            remarks: ['', Validators.required]
        });


    }

    goToRenewPoliciesList(): void {
        this.router.navigateByUrl('/flosure/underwriting/policy-renewal-list');
    }

    goToClientsList(): void {
        this.router.navigateByUrl('/flosure/clients/clients-list');
    }

    showPolicyModal(policy: Policy): void {
        this.isPlanVisible = true;
    }

    showVModal(): void {
        this.isVisible = true;
    }

    handleOk(policyData): void {
        if (this.selectedPlanValue === 'plan') {
            let pAmount = 0;
            let policyCount = 0;
            const policyPlan: Policy[] = [];
            policyPlan.push({
                ...policyData
            });

            this.policyUpdate = policyData;

            pAmount = pAmount + policyData.netPremium;
            policyCount++;

            this.clientName = policyData.client;
            this.netPremium = this.netPremium + policyData.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            this.policiesService.updatePolicy(this.policyUpdate);

            const eDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            eDate.setMonth(
                eDate.getMonth() +
                    this.paymentPlanForm.controls.numberOfInstallments.value
            );
            this.formattedeDate = eDate;

            const dAmount =
                pAmount -
                this.paymentPlanForm.controls.initialInstallmentAmount.value;

            // Create installments
            const iAmount =
                dAmount /
                this.paymentPlanForm.controls.numberOfInstallments.value;
            const installment: InstallmentsModel[] = [];

            const iDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            while (iDate <= eDate) {
                iDate.setMonth(iDate.getMonth() + 1);
                this.formattedDate = iDate;

                // installment.push({
                //     installmentAmount: iAmount,
                //     installmentDate: this.formattedDate,
                //     balance: iAmount,
                //     installmentStatus: 'UnPaid',
                // });
            }

            // Payment Plan
            const pDate = new Date(
                this.paymentPlanForm.controls.startDate.value
            );
            console.log('THis', this.policyData);

            this.planId = v4();
            const plan: IPaymentModel = {
                ...this.paymentPlanForm.value,
                id: this.planId,
                clientId: '',
                clientName: policyData.client,
                numberOfPolicies: policyCount,
                totalPremium: pAmount,
                status: 'UnPaid',
                policyPaymentPlan: policyPlan,
                remainingInstallments: this.paymentPlanForm.controls
                    .numberOfInstallments.value,
                amountPaid: 0,
                numberOfPaidInstallments: 0,
                amountOutstanding: dAmount,
                installments: installment,
                startDate: pDate,
                endDate: this.formattedeDate
            };

            console.log('..........Payment Plan..........');
            console.log(plan);

            this._id = v4();
            const receipt: IReceiptModel = {
                payment_method: '',
                received_from: this.paymentPlanForm.controls.clientName.value,
                on_behalf_of: this.paymentPlanForm.controls.clientName.value,
                captured_by: this.user.ID,
                receipt_status: 'Receipted',
                narration: 'Payment Plan',
                receipt_type: 'Premium Payment',
                sum_in_digits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                today_date: new Date(),
            };

            const planReceipt: PlanReceipt[] = [];
            planReceipt.push({
                allocation_status: 'Unallocated',
                amount: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
            });

            // plan.planReceipt = planReceipt;
            console.log('=====================');

            console.log(receipt, plan);

            // add payment plan
            // this.paymentPlanService.addPaymentPlanReceipt(receipt, plan);

            // add payment plan
            // this.paymentPlanService.addPaymentPlan(plan);
            this.paymentPlanForm.reset();
            this.isPlanVisible = false;
            this.router.navigateByUrl('flosure/accounts/payment-plan');
        } else if (this.selectedPlanValue === 'fully') {
            this.router.navigateByUrl('/flosure/accounts/receipts');
        }

        this.isPlanVisible = false;
    }

    handleCancel(): void {
        this.isPlanVisible = false;
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.policyDetailsForm.get('startDate').value !== '' &&
            this.policyDetailsForm.get('quarter').value !== ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.policyDetailsForm.get('startDate').value,
                quarter: Number(this.policyDetailsForm.get('quarter').value),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-rates-api.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.policyDetailsForm
                        .get('endDate')
                        .setValue(data.endDate);
                });
        }
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
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

    // remove risk from risks table
    removeRisk(id: string): void {
        this.risks = this.risks.filter(risk => risk.id !== id);
        this.displayRisks = this.risks;
        this.updatePolicy();
    }

    // save risks changes after editing
    saveRisk(): void {}

    deleteRow(): void {}

    closeRiskDetails() {
        this.riskDetailsModalVisible = false;
    }

    async renewPolicy(): Promise<void> {
        this.loadingPolicy = true;
        const debitNote: IDebitNoteDTO = {
            companyTelephone: 'Joshua Silwembe',
            companyEmail: 'joshua.silwembe@hobbiton.co.zm',
            vat: '5%',
            pin: '4849304930',
            todayDate: new Date(),
            agency: 'string',
            nameOfInsured: 'Joshua Silwembe',
            addressOfInsured: 'string',
            ref: 'string',
            policyNumber: 'string',
            endorsementNumber: 'string',
            regarding: 'string',
            classOfBusiness: 'string',
            brokerRef: 'string',
            fromDate: new Date(),
            toDate: new Date(),
            currency: 'string',
            basicPremium: 0,
            insuredPremiumLevy: 0,
            netPremium: 0,
            processedBy: 'string'
        };

        const certificate: ICertificateDTO = {
            certificateNumber: 'string',
            policyNumber: 'string',
            clientName: 'string',
            nameOfInsured: 'string',
            address: 'string',
            phone: 'string',
            email: 'james@gmail.com',
            coverType: 'string',
            startDate: new Date(),
            expiryDate: new Date(),
            sumInsured: 0,
            regMark: 'string',
            makeAndType: 'string',
            engine: 'string',
            chassisNumber: 'string',
            yearOfManufacture: 'string',
            color: 'string',
            branch: 'string',
            timeOfIssue: new Date(),
            dateOfIssue: new Date(),
            thirdPartyPropertyDamage: 0,
            thirdPartyInuryAndDeath: 0,
            thirdPartyBoodilyInjury_DeathPerEvent: 0,
            town: 'string'
        };

        const debit$ = '';
        const cert$ = '';

        combineLatest([debit$, cert$]).subscribe(async ([debit, cert]) => {
            // this.debitNoteURL = debit.Location;
            // this.policyCertificateURl = cert.Location;

            // console.log('DEBIT', debit.Location);
            // console.log('CERT', cert.Location);

            // await this.quotesService.addQuoteDocuments()

            const endorsement: Endorsement = {
                ...this.endorsementForm.value,
                type: 'Cancellation Of Cover',
                dateCreated: new Date(),
                dateUpdated: new Date(),
                id: this.policyData.id,
                status: 'Pending'
            };

            // convert to policy
            const policy: Policy = {
                ...this.policyDetailsForm.value,
                receiptStatus: this.status,
                risks: this.risks,
                term: this.policyData.term + 1,
                sumInsured: this.sumArray(this.risks, 'sumInsured'),
                netPremium: this.sumArray(this.risks, 'netPremium'),
                paymentPlan: this.paymentPlan,
                underwritingYear: new Date().getFullYear(),
                user: localStorage.getItem('user')
            };

            this.policyData = policy;

            this.policyData.id = this.policyID;
            this.policyData.policyNumber = this.policyNumber;

            console.log('POLICY>>>>', this.policyData);
            await this.policiesService.renewPolicy(this.policyData);

            this.endorsementService.createEndorsement(
                this.policyData.id,
                endorsement
            );
            setTimeout(() => {
                this.loadingPolicy = false;
            }, 3000);
        });
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleRiskCancel(): void {
        this.isVisible = false;
    }

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    openAddRiskFormModal() {
        this.addRiskFormModalVisible = true;
    }

    recieveAddedrisk(risk) {
        console.log('risk added...222');
        console.log(risk);
        const addedRisk: RiskModel = risk;
        this.addRisk(addedRisk);
    }

    addRisk(risk: RiskModel) {
        this.risks.push(risk);
        this.risks = this.risks;
        this.displayRisks = this.risks;
        this.updatePolicy();
    }

    updatePolicy() {
        this.policyDetailsForm
            .get('netPremium')
            .setValue(this.sumArray(this.risks, 'netPremium'));
    }

    recieveEditedRisk(risk: RiskModel) {
        this.updateRisk(risk);
    }

    updateRisk(risk: RiskModel) {
        const riskIndex = _.findIndex(this.risks, {
            id: risk.id
        });

        this.risks.splice(riskIndex, 1, risk);
    }

    updateRisksTable() {
        this.risks = this.risks;
        this.displayRisks = this.risks;
    }

    recieveUpdate($event) {
        this.policyRenewalUpdates.next($event);
    }

    trackByRiskId(index: number, risk: RiskModel): string {
        return risk.id;
    }
}
