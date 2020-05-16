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
    isVisible = false;
    policyDetailsForm: FormGroup;
    paymentPlanForm: FormGroup;
    premiumComputationForm: FormGroup;
    policydata: Policy[] = [];

    policiesList: Policy[];
    policyNumber: string;
    policyData: Policy = new Policy();
    policy: Policy;
    displayPolicy: Policy;
    policyUpdate: Policy = new Policy();
    isLoading = false;

    //endorsement form
    endorsementForm: FormGroup;

    paymentPlan = 'NotCreated';
    // risk details modal
    riskDetailsModalVisible = false;
    isPlanVisible = false;

    status = 'Unreceipted';

    // risks
    risks: RiskModel[] = [];
    risksLoading = true;

    searchString: string;

    isEditmode = false;
    territorialExtensionWeeks: number;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // low term agreement discount amount
    lowTermAgreementDiscountAmount: number;

    // increase third party amount
    increasedThirdPartyLimitAmount: number;

    // valued client discount amount
    valuedClientDiscountAmount: number;

    // loss of use amount
    territorialExtensionAmount: number;

    // inexperienced driver amount
    inexperiencedDriverAmount: number;

    // under age driver amount
    underAgeDriverAmount: number;

    // selected basic premium input type option are rate and amount
    selectedBasicPremiunTypeValue = 'rate';
    // basic premium amount when user selects amount as basic premium input type
    basicPremiumAmount: number;

    // selected increase third party input type
    selectedIncreaseThirdPartyLimitInputTypeValue = 'rate';
    // selected riot and strike input type
    selectedRiotAndStrikeInputTypeValue = 'rate';
    // selected Car stereo input type
    selectedCarStereoInputTypeValue = 'rate';
    // car stereo amount
    carStereoAmount: number;

    // selected loss of use input type
    selectedLossOfUseInputTypeValue = 'rate';
    // selected territorial extension input type
    selectedTerritorialExtensionInputTypeValue = 'rate';
    // selected no claim discount input type
    selectedNoClaimsDiscountInputTypeValue = 'rate';
    // selected loyalty discount input type
    selectedLoyaltyDiscountInputTypeValue = 'rate';

    // selected valued client discount input type
    selectedValuedClientDiscountInputTypeValue = 'rate';

    // no claim discount amount
    noClaimsDiscountAmount: number;

    // selected low term agreement discount input type
    selectedLowTermAgreementDiscountInputTypeValue = 'rate';

    // loss of use amount
    lossOfUseAmount: number;

    // increase third party amount
    riotAndStrikeAmount: number;

    // Edit risk details
    isRiskDetailsEditmode = false;

    territorialExtensionCountries: number;

    // vehicle make drop down
    vehicleMakeUrl = 'https://api.randomuser.me/?results=5';
    searchChange$ = new BehaviorSubject('');
    vehicleMakeOptionList: string[] = [];
    selectedVehicleMake: string;
    isVehicleMakeLoading = false;

    // vehicle model drop down
    vehicleModelUrl = 'https://api.randomuser.me/?results=5';
    // searchChange$ = new BehaviorSubject('');
    vehicleModelOptionList: string[] = [];
    selectedVehicleModel: string;
    isVehicleModelLoading = false;

    // selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    motorComprehensiveloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        },
        { label: 'Riot and strike', value: 'riotAndStrike' },
        { label: 'Car Stereo', value: 'carStereo' },
        { label: 'Territorial Extension', value: 'territorailExtension' },
        { label: 'Loss Of Use', value: 'lossOfUse' },
        { label: 'Inexperienced Driver', value: 'inexperiencedDriver' },
        { label: 'Under Age Driver', value: 'underAgeDriver' }
    ];

    motorThirdPartyloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        }
    ];
    selectedLoadingValue = {
        label: '',
        value: ''
    };

    // discounts
    discountOptions = [
        { label: 'No claims dicount', value: 'noClaimsDiscount' },
        { label: 'Loyalty Discount', value: 'loyaltyDiscount' },
        { label: 'Valued Client Discount', value: 'valuedClientDiscount' },
        { label: 'Low Term Agreement', value: 'lowTermAgreementDiscount' }
    ];
    selectedDiscountValue = { label: '', value: '' };
    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeIncreasedThirdPartyLimitIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computeDiscountIsLoading = false;
    computePremiumIsLoading = false;
    handleDiscountIsLoading = false;
    // loyalty discount amount
    loyaltyDiscountAmount: number;

    addLoadIsLoading = false;

    //
    data: AOA = [
        [1, 2],
        [3, 4]
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    // selected risk in risk table
    selectedRisk: RiskModel;

    increasedThirdPartyLimitsRateType: string;

    // risk being edited
    currentRiskEdit: RiskModel;
    premiumRateType: string;
    riotAndStrikeRateType: string;
    carStereoRateType: string;
    territorialExtensionRateType: string;
    lossOfUseDailyRateType: string;
    premiumDiscountRateType: string;

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

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' }
    ];

    optionInsuranceTypeList = [
        { label: 'Motor Comprehensive', value: 'Comprehensive' },
        { label: 'Motor Third Party', value: 'ThirdParty' }
    ];
    selectedClassValue = {
        label: 'Motor Comprehensive',
        value: 'Comprehensive'
    };
    selectedPlanValue = 'fully';
    formattedDate: any;
    planId: string;
    // clientName: any;
    netPremium: number;
    formattedeDate: Date;
    _id: string;
    riskComprehensiveForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    sumInsured: number;
    premiumRate: number;
    loads: any[];
    premiumLoadingTotal: number;
    premiumDiscountRate: number;
    basicPremiumLevy: any;
    premiumDiscount: number;
    // selectedLoadingValue: { label: string; value: string };
    addingLoad: boolean;
    riotAndStrikeRate: number;
    increasedThirdPartyLimitsRate: number;
    increasedThirdPartyLimitValue: number;
    carStereoValue: number;
    carStereoRate: number;
    lossOfUseDailyRate: number;
    lossOfUseDays: number;
    //dicounts added
    discounts: DiscountModel[] = [];
    LevyRate = 3;
    policyCertificateURl: string;
    debitNoteURL: string;
    policyID: string;

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
        private endorsementService: EndorsementService
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required]
        });
    }

    // conditional render of agent field based on mode(agent or user)
    agentMode = false;
    switchLoading = false;

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits'
        };
        console.log(value);
    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    };

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    };
    ngOnInit(): void {
        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id.id).subscribe(policy => {
                console.log('CHECKING ID GET', policy);
                this.policyData = policy;
                console.log('CHECKING ID Policy>>>>', this.policyData);

                this.policyID = this.policyData.id;
                this.policyNumber = this.policyData.policyNumber;

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

            this.riskComprehensiveForm = this.formBuilder.group({
                riskStartDate: ['', Validators.required],
                riskQuarter: ['', Validators.required],
                riskEndDate: ['', Validators.required],
                regNumber: ['', Validators.required],
                vehicleMake: ['', Validators.required],
                vehicleModel: ['', Validators.required],
                engineNumber: [''],
                chassisNumber: ['', Validators.required],
                yearOfManufacture: ['', Validators.required],
                color: ['', [Validators.required]],
                // sumInsured: ['', Validators.required],
                productType: ['', Validators.required],
                insuranceType: ['Comprehensive']
            });

            this.riskThirdPartyForm = this.formBuilder.group({
                riskStartDate: ['', Validators.required],
                riskQuarter: ['', Validators.required],
                riskEndDate: ['', Validators.required],
                regNumber: ['', [Validators.required]],
                vehicleMake: ['', [Validators.required]],
                vehicleModel: ['', [Validators.required]],
                engineNumber: [''],
                chassisNumber: ['', [Validators.required]],
                yearOfManufacture: ['', Validators.required],
                color: ['', [Validators.required]],
                productType: ['', [Validators.required]],
                insuranceType: ['ThirdParty']
            });

            this.endorsementForm = this.formBuilder.group({
                effectDate: ['', Validators.required],
                remark: ['', Validators.required]
            });
        });

        // vehicle make loading
        const getVehicleMakeList = (name: string) =>
            this.http
                .get(`${this.vehicleMakeUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map(() => `${name}`);
                    })
                );

        const vehicleMakeOptionList$: Observable<string[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleMakeList));
        vehicleMakeOptionList$.subscribe(data => {
            this.vehicleMakeOptionList = data;
            this.isVehicleMakeLoading = false;
        });

        // vehicle model loading
        const getVehicleModelList = (name: string) =>
            this.http
                .get(`${this.vehicleModelUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map(() => `${name}`);
                    })
                );

        const vehicleModelOptionList$: Observable<string[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleModelList));
        vehicleModelOptionList$.subscribe(data => {
            this.vehicleModelOptionList = data;
            this.isVehicleModelLoading = false;
        });
        // this.route.data.subscribe((data: Policy) => {
        //     console.log('RESOLVED', data);
        //     this.route.params.subscribe((param) => {
        //         this.policyNumber = param.policyNumber;
        //         this.policiesService.getPolicies().subscribe((policies) => {

        //         });
        //     });
        // });
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

        // set values of fields
        // this.policiesService.getPolicies().subscribe((policies) => {
        //     this.policyData = policies.filter(
        //         (x) => x.policyNumber === this.policyNumber
        //     )[0];
        //     this.policyDetailsForm
        //         .get('client')
        //         .setValue(this.policyData.client);
        //     this.policyDetailsForm
        //         .get('nameOfInsured')
        //         .setValue(this.policyData.nameOfInsured);
        //     this.policyDetailsForm
        //         .get('startDate')
        //         .setValue(this.policyData.startDate);
        //     this.policyDetailsForm
        //         .get('endDate')
        //         .setValue(this.policyData.endDate);
        //     this.policyDetailsForm
        //         .get('sumInsured')
        //         .setValue(this.policyData.sumInsured);
        //     this.policyDetailsForm
        //         .get('netPremium')
        //         .setValue(this.policyData.netPremium);
        //     this.policyDetailsForm
        //         .get('currency')
        //         .setValue(this.policyData.currency);
        //     this.policyDetailsForm
        //         .get('timeOfIssue')
        //         .setValue(this.policyData.timeOfIssue);
        //     this.policyDetailsForm
        //         .get('dateOfIssue')
        //         .setValue(this.policyData.dateOfIssue);
        //     this.policyDetailsForm
        //         .get('expiryDate')
        //         .setValue(this.policyData.endDate);
        //     this.policyDetailsForm
        //         .get('quarter')
        //         .setValue(this.policyData.quarter);
        // });
        this.increasedThirdPartyLimitsRateType = 'percentage';
        this.premiumComputationForm = this.formBuilder.group({
            sumInsured: ['', Validators.required],
            premiumRate: ['', Validators.required],
            increasedThirdPartyLimitsRate: ['', Validators.required],
            increasedThirdPartyLimitValue: ['', Validators.required],
            riotAndStrikeRate: ['', Validators.required],
            carStereoRate: ['', Validators.required],
            lossOfUseDailyRate: ['', Validators.required],
            lossOfUseDays: ['', Validators.required],
            premiumDiscountRate: ['', Validators.required]
        });

        // start of initialize computations
        this.sumInsured = 0;
        this.premiumRate = 0;

        this.basicPremium = 0;
        this.premiumLoadingTotal = 0;
        this.premiumDiscount = 0;
        this.premiumDiscountRate = 0;
        this.basicPremiumLevy = 0;
        this.netPremium = 0;

        this.premiumDiscount = 0;
        this.carStereoValue = 0;
        this.carStereoRate = 0;
        this.lossOfUseDays = 0;
        this.lossOfUseDailyRate = 0;
        this.increasedThirdPartyLimitValue = 0;
        this.increasedThirdPartyLimitsRate = 0;
        this.riotAndStrikeRate = 0;

        // rate should be in percentage when page is loaded
        this.premiumRateType = 'percentage';
        this.increasedThirdPartyLimitsRateType = 'percentage';
        this.riotAndStrikeRateType = 'percentage';
        this.carStereoRateType = 'percentage';
        this.territorialExtensionRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';
    }

    // getTimeStamp(policy: Policy): number {
    //     return (policy.startDate as ITimestamp).seconds;
    // }

    // getEndDateTimeStamp(policy: Policy): number {
    //     return (policy.endDate as ITimestamp).seconds;
    // }

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
            this.receiptService.updatePolicy(this.policyUpdate);

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

                installment.push({
                    installmentAmount: iAmount,
                    installmentDate: this.formattedDate,
                    balance: iAmount,
                    installmentStatus: 'UnPaid'
                });
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
                id: this._id,
                paymentMethod: '',
                receivedFrom: this.paymentPlanForm.controls.clientName.value,
                onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                capturedBy: 'charles malama',
                policyNumber: '',
                receiptStatus: 'Receipted',
                narration: 'Payment Plan',
                receiptType: 'Premium Payment',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                todayDate: new Date()
            };

            const planReceipt: PlanReceipt[] = [];
            planReceipt.push({
                id: this._id,
                onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                allocationStatus: 'Unallocated',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                policyNumber: ''
            });

            plan.planReceipt = planReceipt;
            console.log('=====================');

            console.log(receipt, plan);

            // add payment plan
            this.paymentPlanService.addPaymentPlanReceipt(receipt, plan);

            // add payment plan
            // this.paymentPlanService.addPaymentPlan(plan);
            this.paymentPlanForm.reset();
            this.isVisible = false;
            this.router.navigateByUrl('flosure/accounts/payment-plan');
        } else if (this.selectedPlanValue === 'fully') {
            this.router.navigateByUrl('/flosure/accounts/receipts');
        }

        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    handleComprehensiveRiskEndDateCalculation(): void {
        if (
            this.riskComprehensiveForm.get('riskStartDate').value != '' &&
            this.riskComprehensiveForm.get('riskQuarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskComprehensiveForm.get('riskStartDate')
                    .value,
                quarter: Number(
                    this.riskComprehensiveForm.get('riskQuarter').value
                ),
                discount: 0,
                appliedDiscount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.riskComprehensiveForm
                        .get('riskEndDate')
                        .setValue(data.endDate);
                });
        }
    }

    handleThirdPartyRiskEndDateCalculation(): void {
        this.handleBasicPremiumCalculationThirdParty();
        if (
            this.riskThirdPartyForm.get('riskStartDate').value != '' &&
            this.riskThirdPartyForm.get('riskQuarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(
                    this.riskThirdPartyForm.get('riskQuarter').value
                ),
                appliedDiscount: 0,
                discount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0,
                lossOfUseRate: 0,
                territorialExtensionWeeks: 0,
                territorialExtensionCountries: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy: 0
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.riskThirdPartyForm
                        .get('riskEndDate')
                        .setValue(data.endDate);
                });
        }
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.policyDetailsForm.get('startDate').value != '' &&
            this.policyDetailsForm.get('quarter').value != ''
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
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.policyDetailsForm
                        .get('endDate')
                        .setValue(data.endDate);
                });
        }
    }

    handleBasicPremiumCalculation(): void {
        if (this.sumInsured != 0 && this.premiumRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskComprehensiveForm.get('riskStartDate')
                    .value,
                quarter: Number(
                    this.riskComprehensiveForm.get('riskQuarter').value
                ),
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
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.basicPremium = Number(data.basicPremium);
                    this.handleNetPremium();
                });
        }
    }

    handleBasicPremiumCalculationThirdParty(): void {
        if (
            this.riskThirdPartyForm.get('productType').value != '' &&
            this.riskThirdPartyForm.get('riskQuarter').value != ''
        ) {
            if (this.riskThirdPartyForm.get('productType').value == 'Private') {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 165;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 280;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 370;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 464;
                }
            }
            if (
                this.riskThirdPartyForm.get('productType').value == 'Commercial'
            ) {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 199;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 340;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 452;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 566;
                }
            }
            if (
                this.riskThirdPartyForm.get('productType').value == 'Bus/Taxi'
            ) {
                if (this.riskThirdPartyForm.get('riskQuarter').value == 1) {
                    this.basicPremium = 270;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 2) {
                    this.basicPremium = 464;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 3) {
                    this.basicPremium = 618;
                }
                if (this.riskThirdPartyForm.get('riskQuarter').value == 4) {
                    this.basicPremium = 772;
                }
            }
        }

        this.handleNetPremium();
    }

    // onSubmit() {
    //     const some = this.quoteForm.value;
    //     this.quoteService.addMotorQuotation(some);

    //     localStorage.setItem('motor', JSON.stringify(some));
    //     this.quoteService.getRisk('an');
    // }

    // add third party risk
    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
            riskId: v4(),
            sumInsured: 0,
            premiumRate: 0,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
            netPremium: this.netPremium,
            insuranceType: this.selectedClassValue.value
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskThirdPartyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    // reset third party risk form
    resetThirdPartyRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // add comprehesive risk
    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            riskId: v4(),
            sumInsured: Number(this.sumInsured),
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            discounts: this.discounts,
            loadingTotal: this.premiumLoadingTotal,
            discountTotal: this.premiumDiscount,
            discountRate: this.premiumDiscountRate,
            premiumLevy: this.basicPremiumLevy,
            netPremium: this.netPremium,
            insuranceType: this.selectedClassValue.value
        });
        this.risks = [...this.risks, ...some];

        // reset form after submitting
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    // reset comprehensive risk form
    resetComprehensiveRiskForm(e: MouseEvent) {
        e.preventDefault();
        this.riskComprehensiveForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    resetForms() {
        this.riskComprehensiveForm.reset();
        this.riskThirdPartyForm.reset();
        (this.sumInsured = 0),
            (this.premiumRate = 0),
            (this.basicPremium = 0),
            (this.loads = []),
            (this.premiumLoadingTotal = 0),
            (this.premiumDiscountRate = 0),
            (this.netPremium = 0);
        this.basicPremiumLevy = 0;
        this.premiumDiscount = 0;
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        console.log('RiSK CHECK>>>>', risk);
        this.selectedRisk = risk;
        this.riskDetailsModalVisible = true;

        if (this.selectedClassValue.value === 'Comprehensive') {
            this.riskComprehensiveForm
                .get('vehicleMake')
                .setValue(risk.vehicleMake);
            this.riskComprehensiveForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskComprehensiveForm
                .get('yearOfManufacture')
                .setValue(risk.yearOfManufacture);
            this.riskComprehensiveForm
                .get('regNumber')
                .setValue(risk.regNumber);
            this.riskComprehensiveForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskComprehensiveForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskComprehensiveForm
                .get('productType')
                .setValue(risk.productType);
            this.riskComprehensiveForm
                .get('riskStartDate')
                .setValue(risk.riskStartDate);
            this.riskComprehensiveForm
                .get('riskQuarter')
                .setValue(risk.riskQuarter);
            this.riskComprehensiveForm
                .get('riskEndDate')
                .setValue(risk.riskEndDate);
            this.riskComprehensiveForm.get('color').setValue(risk.color);
        } else {
            this.riskComprehensiveForm
                .get('vehicleMake')
                .setValue(risk.vehicleMake);
            this.riskComprehensiveForm
                .get('vehicleModel')
                .setValue(risk.vehicleModel);
            this.riskComprehensiveForm
                .get('yearOfManufacture')
                .setValue(risk.yearOfManufacture);
            this.riskThirdPartyForm.get('regNumber').setValue(risk.regNumber);
            this.riskThirdPartyForm
                .get('engineNumber')
                .setValue(risk.engineNumber);
            this.riskThirdPartyForm
                .get('chassisNumber')
                .setValue(risk.chassisNumber);
            this.riskThirdPartyForm
                .get('productType')
                .setValue(risk.productType);
            this.riskThirdPartyForm
                .get('riskStartDate')
                .setValue(risk.riskStartDate);
            this.riskThirdPartyForm
                .get('riskQuarter')
                .setValue(risk.riskQuarter);
            this.riskThirdPartyForm
                .get('riskEndDate')
                .setValue(risk.riskEndDate);
            this.riskThirdPartyForm.get('color').setValue(risk.color);
        }

        this.selectedVehicleMake = risk.vehicleMake;
        this.selectedVehicleModel = risk.vehicleModel;
        this.sumInsured = risk.sumInsured;
        this.premiumRate = risk.premiumRate;
        this.loads = risk.loads;
        this.discounts = risk.discounts;
        this.basicPremium = risk.basicPremium;
        this.premiumLoadingTotal = risk.loadingTotal;
        this.premiumDiscount = risk.discountTotal;
        this.basicPremiumLevy = risk.premiumLevy;
        this.netPremium = risk.netPremium;
    }

    // remove risk from risks table
    removeRisk(riskId: string): void {
        this.risks = this.risks.filter(risk => risk.riskId !== riskId);
    }

    // save risks changes after editing
    saveRisk(): void {
        this.currentRiskEdit = this.selectedRisk;

        if (this.selectedClassValue.value === 'Comprehensive') {
            // comprehensive risk
            const some: RiskModel = {
                ...this.riskComprehensiveForm.value,
                sumInsured: Number(this.sumInsured),
                premiumRate: this.premiumRate,
                basicPremium: this.basicPremium,
                loads: this.loads,
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedClassValue.value
            };
            this.currentRiskEdit = some;

            let riskIndex = _.findIndex(this.risks, {
                riskId: this.selectedRisk.riskId
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
            this.risks = this.risks;
        } else {
            // third party risk
            const some: RiskModel = {
                ...this.riskThirdPartyForm.value,
                sumInsured: 0,
                premiumRate: 0,
                basicPremium: this.basicPremium,
                loads: this.loads,
                loadingTotal: this.premiumLoadingTotal,
                discountRate: this.premiumDiscountRate,
                premiumLevy: this.basicPremiumLevy,
                netPremium: this.netPremium,
                insuranceType: this.selectedClassValue.value
            };
            this.selectedRisk = some;

            let riskIndex = _.findIndex(this.risks, {
                riskId: this.selectedRisk.riskId
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
        }

        this.isRiskDetailsEditmode = false;
    }

    deleteRow(): void {}

    closeRiskDetails() {
        this.riskDetailsModalVisible = false;
    }

    async renewPolicy(): Promise<void> {
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

        const debit$ = this.quotesService.generateDebitNote(debitNote);
        const cert$ = this.quotesService.generateCertificate(certificate);

        combineLatest([debit$, cert$]).subscribe(async ([debit, cert]) => {
            this.debitNoteURL = debit.Location;
            this.policyCertificateURl = cert.Location;

            console.log('DEBIT', debit.Location);
            console.log('CERT', cert.Location);

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
        });
    }

    // sumArray(items, prop) {
    //     return items.reduce(function (a, b) {
    //         return a + b[prop];
    //     }, 0);
    // }

    // filter by search
    // search(value: string): void {
    //     if (value === '' || !value) {
    //         this.displayQuote = this.quote;
    //     }

    //     this.displayQuote.risks = this.quote.risks.filter((quote) => {
    //         return (
    //             quote.insuranceType
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             quote.regNumber.toLowerCase().includes(value.toLowerCase()) ||
    //             quote.chassisNumber
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             quote.vehicleMake.toLowerCase().includes(value.toLowerCase()) ||
    //             quote.vehicleModel
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             quote.engineNumber
    //                 .toLowerCase()
    //                 .includes(value.toLowerCase()) ||
    //             quote.productType.toLowerCase().includes(value.toLowerCase()) ||
    //             quote.color.toLowerCase().includes(value.toLowerCase())
    //         );
    //     });
    // }
    // async addPolicy(): Promise<void> {
    //     const policy: Policy = {
    //         ...this.quoteForm.value,
    //         // clientCode
    //         user: this.agentMode
    //             ? this.quoteForm.get('user').value
    //             : localStorage.getItem('user'),
    //         risks: this.risks,
    //     };

    //     const quoteDto: IQuoteDTO = {
    //         quoteNumber: quote.quoteNumber,
    //         revisionNumber: '00001',
    //         startDate: quote.startDate as Date,
    //         endDate: quote.endDate as Date,
    //         client: quote.client,
    //         status: 'Draft',
    //         preparedBy: 'Charles Malama',
    //         motorQuotationModelId: quote.id,
    //         dateCreated: new Date(),
    //         clientCode: quote.clientCode,
    //         messageCode: '123001',
    //         coverCode: quote.coverCode,
    //         currency: quote.currency,
    //         riskModelId: '023001',
    //         regNumber: quote.risks[0].regNumber,
    //         vehicleMake: quote.risks[0].vehicleMake,
    //         vehicleModel: quote.risks[0].vehicleModel,
    //         engineNumber: quote.risks[0].engineNumber,
    //         chassisNumber: quote.risks[0].chassisNumber,
    //         color: quote.risks[0].color,
    //         estimatedValue: quote.risks[0].estimatedValue,
    //         productType: quote.risks[0].productType,
    //         messageModelId: '02501',
    //         description: '',
    //         coverModelId: '0948398',
    //     };

    //     this.quoteService.generateQuote(quoteDto).subscribe((res) => {
    //         this.gqlquoteService
    //             .addQuote({
    //                 clientId: 'some', // System can't keep track of this guy
    //                 quoteNumber: quote.quoteNumber,
    //                 quoteUrl: res.Location,
    //             })
    //             .then((res) => {
    //                 res.subscribe((x) => {
    //                     console.log(x);
    //                 });
    //             });
    //     });

    //     await this.quoteService
    //         .addMotorQuotation(quote)
    //         .then(() => {
    //             this.msg.success('Quotation Successfully created');
    //             this.router.navigateByUrl('/flosure/quotes/quotes-list');
    //         })
    //         .catch(() => {
    //             this.msg.error('Quotation Creation Failed');
    //         });
    // }

    showModal(): void {
        this.isVisible = true;
    }

    handleRiskCancel(): void {
        this.isVisible = false;
    }

    handleDownloadTemplate() {
        const headings = [
            [
                'insuranceType',
                'registrationNumber',
                'vehicleMake',
                'vehicleModel',
                'engineNumber',
                'chassisNumber',
                'color',
                'productType',
                'sumInsured',
                'netPremium'
            ]
        ];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headings);

        // const element = document.getElementById('risksTemplateTable');
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    // what happens when a file is uploaded
    handleChange({ file }: UploadChangeParam): void {
        const status = file.status;

        // when file is uploading
        if (status !== 'uploading') {
            // console.log(file);
            //
        }

        // when file is done uploading
        if (status === 'done') {
            this.msg.success(`${file.name} file uploaded successfully.`);
            this.fileLocation = file.response.Location;
            console.log(this.fileLocation);
            this.isVisible = false;

            // get uploaded excel file and convert it to array
            // XMLHttpRequest
            const oReq = new XMLHttpRequest();
            oReq.open('GET', this.fileLocation, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = () => {
                const arraybuffer = oReq.response;

                // //convert data to binary string
                const data = new Uint8Array(arraybuffer);
                const arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');

                // call XLSX
                const workbook = XLSX.read(bstr, { type: 'binary' });
                workbook.SheetNames.forEach(sheetName => {
                    const imported_risks: RiskModel[] = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                    );
                    this.risks = imported_risks;
                });
            };

            oReq.send();

            // when there is an error during upload
        } else if (status === 'error') {
            this.msg.error(`${file.name} file upload failed.`);
        }
    }

    switchMode(): void {
        if (!this.switchLoading) {
            this.switchLoading = true;
            setTimeout(() => {
                this.agentMode = !this.agentMode;
                this.switchLoading = false;
            }, 500);
        }
    }

    // vehicle make loading
    onVehicleMakeSearch(value: string): void {
        this.isVehicleMakeLoading = true;
        this.searchChange$.next(value);
    }

    // vehicle model loading
    onVehicleModelSearch(value: string): void {
        this.isVehicleModelLoading = true;
        this.searchChange$.next(value);
    }

    addLoad() {
        this.addLoadIsLoading = true;
        setTimeout(() => {
            this.addingLoad = true;
            this.addLoadIsLoading = false;
        }, 1000);
    }

    // Premium computation methods
    // Basic Premum Computation

    handleDiscount(discountType: DiscountType) {
        this.handleDiscountIsLoading = true;
        // following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
        );

        // if the checked loading are not in loads array set there values to Zero!
        if (!riotAndStrikeInLoads) {
            this.riotAndStrikeRate = 0;
        }
        if (!increaseThirdPartyLimitInLoads) {
            this.increasedThirdPartyLimitsRate = 0;
            this.increasedThirdPartyLimitValue = 0;
        }
        if (!carStereoInLoads) {
            this.carStereoValue = 0;
            this.carStereoRate = 0;
        }
        if (!lossOfUseInLoads) {
            this.lossOfUseDailyRate = 0;
            this.lossOfUseDays = 0;
        }

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: Number(this.premiumDiscount),
            discount: Number(this.premiumDiscountRate) / 100,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.discounts.push({
                    discountType,
                    amount: Number(data.discount)
                });
                this.premiumDiscount = this.sumArray(this.discounts, 'amount');
                this.handleNetPremium();
                this.handleDiscountIsLoading = false;
            });
    }

    handleDiscountThirdParty() {
        this.handleDiscountIsLoading = true;
        // following methods check if the repective loads are in the loads array
        const riotAndStrikeInLoads = this.loads.some(
            item => item.loadType === 'Riot And Strike'
        );
        const increaseThirdPartyLimitInLoads = this.loads.some(
            item => item.loadType === 'Increased Third Party Limit'
        );
        const carStereoInLoads = this.loads.some(
            item => item.loadType === 'Car Stereo'
        );
        const lossOfUseInLoads = this.loads.some(
            item => item.loadType === 'Loss Of Use'
        );

        // if the checked loading are not in loads array set there values to Zero!
        if (!riotAndStrikeInLoads) {
            this.riotAndStrikeRate = 0;
        }
        if (!increaseThirdPartyLimitInLoads) {
            this.increasedThirdPartyLimitsRate = 0;
            this.increasedThirdPartyLimitValue = 0;
        }
        if (!carStereoInLoads) {
            this.carStereoValue = 0;
            this.carStereoRate = 0;
        }
        if (!lossOfUseInLoads) {
            this.lossOfUseDailyRate = 0;
            this.lossOfUseDays = 0;
        }

        if (this.premiumDiscountRate != 0) {
            const request: IRateRequest = {
                sumInsured: Number(this.sumInsured),
                premiumRate: Number(this.premiumRate) / 100,
                startDate: this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(
                    this.riskThirdPartyForm.get('riskQuarter').value
                ),
                appliedDiscount: this.premiumDiscount,
                discount: Number(this.premiumDiscountRate) / 100,
                carStereo: Number(this.carStereoValue),
                carStereoRate: Number(this.carStereoRate) / 100,
                lossOfUseDays: Number(this.lossOfUseDays),
                lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
                territorialExtensionWeeks: Number(
                    this.territorialExtensionWeeks
                ),
                territorialExtensionCountries: Number(
                    this.territorialExtensionCountries
                ),
                thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
                thirdPartyLimitRate:
                    Number(this.increasedThirdPartyLimitsRate) / 100,
                riotAndStrike: Number(this.riotAndStrikeRate) / 100,
                levy: 0.03
            };
            this.http
                .post<IRateResult>(
                    `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                    request
                )
                .subscribe(data => {
                    this.premiumDiscount = Number(data.discount);
                    this.handleNetPremium();
                    this.handleDiscountIsLoading = false;
                });
        }
    }

    computeThirdPartyPremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.netPremium = Number(data.totalPremium);
                this.handleNetPremium();
                this.computePremiumIsLoading = false;
            });
    }

    // Loading computation
    computeRiotAndStrike() {
        this.computeRiotAndStrikeIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Riot And Strike',
                    amount: Number(data.riotAndStrikePremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeRiotAndStrikeIsLoading = false;
            });
    }

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: Number(data.thirdPartyLoadingPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeIncreasedThirdPartyLimitIsLoading = false;
            });
    }

    computeIncreasedThirdPartyLimitThirdParty() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

        const request: IRateRequest = {
            sumInsured: 0,
            premiumRate: 0,
            startDate: this.riskThirdPartyForm.get('riskStartDate').value,
            quarter: Number(this.riskThirdPartyForm.get('riskQuarter').value),
            appliedDiscount: this.premiumDiscount,
            discount: Number(this.premiumDiscountRate) / 100,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: Number(data.thirdPartyLoadingPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeIncreasedThirdPartyLimitIsLoading = false;
            });
    }

    computeCarStereo() {
        this.computeCarStereoIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: this.premiumDiscount,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Car Stereo',
                    amount: Number(data.carStereoPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeCarStereoIsLoading = false;
            });
    }

    computeTerritorialExtension() {
        this.computeTerritorialExtensionIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: Number(this.premiumDiscount),
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Territorial Extension',
                    amount: Number(data.territorialExtensionPremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeTerritorialExtensionIsLoading = false;
            });
    }

    computeLossOfUse() {
        this.computeLossOfUseIsLoading = true;

        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: Number(this.premiumRate) / 100,
            startDate: this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(
                this.riskComprehensiveForm.get('riskQuarter').value
            ),
            discount: Number(this.premiumDiscountRate) / 100,
            appliedDiscount: this.premiumDiscount,
            carStereo: Number(this.carStereoValue),
            carStereoRate: Number(this.carStereoRate) / 100,
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: Number(this.lossOfUseDailyRate) / 100,
            territorialExtensionWeeks: Number(this.territorialExtensionWeeks),
            territorialExtensionCountries: Number(
                this.territorialExtensionCountries
            ),
            thirdPartyLimit: Number(this.increasedThirdPartyLimitValue),
            thirdPartyLimitRate:
                Number(this.increasedThirdPartyLimitsRate) / 100,
            riotAndStrike: Number(this.riotAndStrikeRate) / 100,
            levy: 0.03
        };
        this.http
            .post<IRateResult>(
                `https://flosure-premium-rates.herokuapp.com/rates/comprehensive`,
                request
            )
            .subscribe(data => {
                this.loads.push({
                    loadType: 'Loss Of Use',
                    amount: Number(data.lossOfUsePremium)
                });
                this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
                this.handleNetPremium();
                this.computeLossOfUseIsLoading = false;
            });
    }

    removeLoad(i: LoadModel, e: MouseEvent): void {
        e.preventDefault();
        if (this.loads.length > 0) {
            const index = this.loads.indexOf(i);
            this.loads.splice(index, 1);
            this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        }
        this.handleNetPremium();
    }

    removeDiscount(i: DiscountModel, e: MouseEvent): void {
        e.preventDefault();
        if (this.discounts.length > 0) {
            const index = this.discounts.indexOf(i);
            this.discounts.splice(index, 1);
            this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        }
        this.handleNetPremium();
    }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;
    }

    // Add risk validation
    validateriskComprehensiveFormDetails(): boolean {
        if (this.riskComprehensiveForm.valid) {
            if (
                (this.sumInsured && this.sumInsured !== 0) ||
                (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
            ) {
                if (
                    (this.premiumRate && this.premiumRate !== 0) ||
                    (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
                ) {
                    if (this.netPremium > 0) {
                        return true;
                    }
                }
            }
        }
    }

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    // following method adds basic premium + loading - discount then applies levy then finds net premium
    handleNetPremium() {
        this.basicPremiumLevy =
            (this.LevyRate / 100) *
            (this.basicPremium +
                this.premiumLoadingTotal -
                this.premiumDiscount);
        this.netPremium =
            this.basicPremium +
            this.premiumLoadingTotal -
            this.premiumDiscount +
            this.basicPremiumLevy;

        console.log(
            'ERROR TRACKING',
            (this.LevyRate / 100) *
                (this.basicPremium +
                    this.premiumLoadingTotal -
                    this.premiumDiscount),
            this.LevyRate,
            this.basicPremium,
            this.premiumLoadingTotal,
            this.premiumDiscount
        );
    }

    // changes the quote basic premium to the inputed amount
    handleBasicPremiumAmount() {
        this.basicPremium = Number(this.basicPremiumAmount);
        this.handleNetPremium();
    }

    // changes the quote increase third party limit to inputed amount
    handleIncreasedThirdPartyLimitAmount() {
        this.loads.push({
            loadType: 'Increased Third Party Limit',
            amount: Number(this.increasedThirdPartyLimitAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote riot and strike to inputed amount
    handleRiotAndStrikeAmount() {
        this.loads.push({
            loadType: 'Riot And Strike',
            amount: Number(this.riotAndStrikeAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote car stereo to inputed amount
    handleCarStereoAmount() {
        this.loads.push({
            loadType: 'Car Stereo',
            amount: Number(this.carStereoAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleLossOfUseAmount() {
        this.loads.push({
            loadType: 'Loss Of Use',
            amount: Number(this.lossOfUseAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleTerritorialExtensionAmount() {
        this.loads.push({
            loadType: 'Territorial Extension',
            amount: Number(this.territorialExtensionAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleInexperiencedDriverAmount() {
        this.loads.push({
            loadType: 'Inexperienced Driver',
            amount: Number(this.inexperiencedDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // changes the quote loss of use loading to inputed amount
    handleUnderAgeDriverAmount() {
        this.loads.push({
            loadType: 'Under Age Driver',
            amount: Number(this.underAgeDriverAmount)
        });
        this.premiumLoadingTotal = this.sumArray(this.loads, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleNoClaimsDiscountAmount() {
        this.discounts.push({
            discountType: 'No Claims Discount',
            amount: Number(this.noClaimsDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLoyaltyDiscountAmount() {
        this.discounts.push({
            discountType: 'Loyalty Discount',
            amount: Number(this.loyaltyDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleValuedClientDiscountAmount() {
        this.discounts.push({
            discountType: 'Valued Client Discount',
            amount: Number(this.valuedClientDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }

    // adds inputted discount to total discount amount
    handleLowTermAgreementDiscountAmount() {
        this.discounts.push({
            discountType: 'Low Term Agreement Discount',
            amount: Number(this.lowTermAgreementDiscountAmount)
        });
        this.premiumDiscount = this.sumArray(this.discounts, 'amount');
        this.handleNetPremium();
    }
}
