import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    LoadModel,
    DiscountType,
    DiscountModel,
    LimitsOfLiability,
    Excess
} from '../../models/quote.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import * as jwt_decode from 'jwt-decode';
// import { ITimestamp } from 'src/app/claims/models/claim.model';
import { IDebitNoteDTO } from '../../models/debit-note.dto';
import { ICertificateDTO } from '../../models/certificate.dto';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';
import { UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import _ from 'lodash';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IBroker,
    IAgent,
    ISalesRepresentative
} from 'src/app/settings/components/agents/models/agents.model';
import { ImageElement } from 'canvg';
import {
    DebitNote,
    CoverNote
} from 'src/app/underwriting/documents/models/documents.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import {
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
    IExccess
} from 'src/app/settings/models/underwriting/clause.model';
import {
    VehicleBodyType,
    MotorComprehensiveLoadingOptions,
    MotorThirdPartyLoadingOptions,
    DiscountOptions,
    SourceOfBusinessOptions,
    ProductTypeOptions,
    InsuranceTypeOptions,
    LimitsOfLiabilityOptions
} from '../../selection-options';
import moment from 'moment';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { v4 } from 'uuid';
import { AccountService } from 'src/app/accounts/services/account.service';
import { IDiscounts } from '../../models/discounts.model';
import { VehicleDetailsModel } from '../../models/vehicle-details.model';
import {
    PremiumComputationDetails,
    PremiumComputation
} from '../../models/premium-computations.model';
import { ITotalsModel } from '../../models/totals.model';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
import { PremiumComputationComponent } from '../premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from '../premium-computation-details/premium-computation-details.component';
import { ExtensionsComponent } from '../extensions/extensions.component';
import { DiscountsComponent } from '../discounts/discounts.component';
import { TotalsViewComponent } from '../totals-view/totals-view.component';
import { VehicleDetailsServiceService } from '../../services/vehicle-details-service.service';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { AllocationPolicy } from '../../../accounts/components/models/allocations.model';
import { AllocationsService } from '../../../accounts/services/allocations.service';
import { CommisionSetupsService } from '../../../settings/components/agents/services/commision-setups.service';
import { ICommissionSetup } from '../../../settings/components/agents/models/commission-setup.model';
import { PropertyDetailsModel } from '../../models/fire-class/property-details.model';
import { PropertyDetailsComponent } from '../fire-class/property-details/property-details.component';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { PermissionsModel } from '../../../users/models/roles.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';
import { CreateQuoteComponent } from '../create-quote/create-quote.component';
import { TransactionModel } from '../../../clients/models/client.model';

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
    selector: 'app-quote-details',
    templateUrl: './quote-details.component.html',
    styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {
    // view risk modal
    viewRiskModalVisible = false;

    // quote details loading feedback
    isQuoteDetailsLoading = false;

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

    vehicleBodyType = VehicleBodyType;
    motorComprehensiveloadingOptions = MotorComprehensiveLoadingOptions;
    motorThirdPartyloadingOptions = MotorThirdPartyLoadingOptions;
    discountOptions = DiscountOptions;
    sourceOfBusinessOptions = SourceOfBusinessOptions;
    commissionAmount = 0;

    private header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: 'Douglas.Chilungu:aplusgeneral@2019'
    });
    clauses: IPolicyClauses[];
    wordings: IPolicyWording[];
    extensions: IPolicyExtension[];
    // form
    quoteDetailsForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    excessesForm: FormGroup;
    combinedLimitsForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;

    // intermediaries
    brokers: IBroker[];
    agents: IAgent[];
    salesRepresentatives: ISalesRepresentative[];
    intermediaries: Array<IAgent & IBroker & ISalesRepresentative>;

    broker: IBroker;
    agent: IAgent;
    salesRepresentative: ISalesRepresentative;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // excel template data
    data: AOA = [
        [1, 2],
        [3, 4]
    ];

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    // quotesLists
    quotesList: MotorQuotationModel[] = [];
    quotesLoading = true;
    risks: RiskModel[] = [];
    numberOfRisks: number;

    // selected risk in risk table
    selectedRisk: RiskModel;

    // risk being edited
    currentRiskEdit: RiskModel;

    // risk details modal
    quoteRiskDetailsModalVisible = false;

    // Edit risk details
    isRiskDetailsEditmode = false;

    // close add risk panel
    isAddRiskPanelOpen: boolean;

    /// Premium Computation
    basicPremium: number;
    basicPremiumLevy: number;
    sumInsured: number;
    premiumRate: number;
    // Loading
    premiumLoadingTotal: number;

    // Discount
    premiumDiscountRate: number;
    premiumDiscount: number;
    totalPremium: number;
    netPremium: number;

    // loads added to loading
    loads: LoadModel[] = [];

    // dicounts added
    discounts: IDiscounts[] = [];
    // excesses
    excesses: Excess[] = [];

    // for quote document
    quoteBasicPremium: number;
    quoteLoadingTotal: number;
    quoteDiscountTotal: number;
    quoteSumInsured: number;
    quoteLevy: number;
    quoteNetPremium: number;


    status = 'Unreceipted';

    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    selectedLimits = { label: 'Standard', value: 'standardLimits' };

    selectedLoadingValue = {
        label: '',
        value: ''
    };

    selectedDiscountValue = { label: '', value: '' };

    selectedSourceOfBusiness: string;

    quoteData: MotorQuotationModel = new MotorQuotationModel();

    isQuoteApproved = false;
    approvingQuote = false;

    // quoteNumber
    quoteNumber: string;
    quote: MotorQuotationModel = new MotorQuotationModel();
    displayQuote: MotorQuotationModel;

    // source of business details
    sourceOfBusiness: string;

    selectedQuote: MotorQuotationModel;
    isEditmode = false;

    // modal
    isVisible = false;
    isConfirmLoading = false;
    showDocumentModal = false;

    // Quote PDFs modal
    isViewQuotePDFVisible = false;
    isViewDraftQuotePDFVisible = false;
    isViewFireDraftQuotePDFVisible = false;

    searchString: string;


    paymentPlan = 'NotCreated';
    policiesCount: number;
    getInsuranceType = '';
    selectedPlan = 'fully';
    isPlanVisible = false;
    isConfirmReceiptLoading = false;
    isFullPayment = false;
    receiptForm: FormGroup;
    paymentPlanForm: FormGroup;
    optionTypeOfReceiptList = [
        { label: 'Premium Payment', value: 'Premium Payment' },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        {
            label: 'Imprest Retirement Receipt',
            value: 'Imprest Retirement Receipt'
        },
        { label: 'Third Party Recovery', value: 'Third Party Recovery' },
        { label: 'General Receipt', value: 'General Receipt' }
    ];

    paymentMethodList = [
        { label: 'Cash', value: 'cash' },
        { label: 'EFT', value: 'eft' },
        { label: 'Bank Transfer', value: 'bank transfer' },
        { label: 'Cheque', value: 'cheque' }
    ];
    paymentMethod: any;
    submitted = false;
    _id = '';
    receiptNum: string;
    isOkLoading = false;
    amount = '';
    policyId: string;
    newRisks: RiskModel[];
    // Excess Variable
    excessList: IExccess[] = [];

    excessTHP: IExccess[] = [];
    excessAct: IExccess[] = [];
    excessFT: IExccess[] = [];
    limitsOfLiabilities: LimitsOfLiability[] = [];
    commission: ICommissionSetup;
    allocationPolicy: AllocationPolicy;

    currentClass: IClass;

    userToken: any;
    decodedJwtData: any;

  permission: PermissionsModel;
  user: UserModel;
  isPresent: PermissionsModel;
  approveQuote = 'approve_quote';
  editQuote = 'edit_quote';
  deleteRisk = 'delete_risk';
  admin = 'admin';
  loggedIn = localStorage.getItem('currentUser');
  debitNoteNumber: any;

  transaction: any;

    constructor(
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private router: Router,
        private quotesService: QuotesService,
        private readonly clientsService: ClientsService,
        private route: ActivatedRoute,
        private msg: NzMessageService,
        private http: HttpClient,
        private readonly agentsService: AgentsService,
        private productClauseService: ClausesService,
        private receiptService: AccountService,
        private message: NzMessageService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private propertyDetailsComponent: PropertyDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private premiumComputationService: PremiumComputationService,
        private allocationService: AllocationsService,
        private commisionSetupsService: CommisionSetupsService,
        private classHandler: InsuranceClassHandlerService,
        private createQuoteComponent: CreateQuoteComponent,
        private  usersService: UsersService,
    ) {
        this.receiptForm = this.formBuilder.group({
            receivedFrom: ['', Validators.required],
            sumInDigits: [''],
            paymentMethod: ['', Validators.required],
            tpinNumber: ['4324324324324324'],
            address: [''],
            receiptType: ['', Validators.required],
            narration: ['', Validators.required],
            sumInWords: [''],
            dateReceived: [''],
            todayDate: [''],
            remarks: [''],
            cheqNumber: ['']
        });
    }

    ngOnInit(): void {
        this.userToken = localStorage.getItem('currentUser');
        this.decodedJwtData = jwt_decode(this.userToken);
        this.isQuoteDetailsLoading = true;
        setTimeout(() => {

            this.isQuoteDetailsLoading = false;
        }, 4000);

        this.route.params.subscribe(param => {
            this.quoteNumber = param.quoteNumber;
            this.quotesService.getMotorQuotations().subscribe(quotes => {
                this.quoteData = quotes.filter(
                    x => x.quoteNumber === this.quoteNumber
                )[0];
                this.decodedJwtData = jwt_decode(this.loggedIn);

                this.usersService.getUsers().subscribe((users) => {
                this.user = users.filter((x) => x.ID === this.decodedJwtData.user_id)[0];

                this.isPresent = this.user.Permission.find((el) => el.name === this.admin || el.name === this.approveQuote ||
                  el.name === this.editQuote || el.name === this.deleteRisk);

                console.log('USERS>>>', this.user, this.isPresent, this.admin);
              });
                this.currentClass = this.quoteData.class;
                this.classHandler.changeSelectedClass(this.quoteData.class);

                this.commisionSetupsService
                    .getCommissionSetups()
                    .subscribe(commission => {
                        this.commission = commission.filter(
                            x =>
                                x.intermediaryId ===
                                this.quoteData.intermediaryId
                        )[0];
                    });
                console.log('quote data: ', this.quoteData);
                this.quotesList = quotes;
                this.quote = this.quotesList.filter(
                    x => x.quoteNumber === this.quoteNumber
                )[0];

                this.risks = this.quoteData.risks;

                this.excessList = this.risks[0].excesses;

                this.limitsOfLiabilities = this.risks[0].limitsOfLiability;
                this.productClauseService.getPolicyClauses().subscribe(res => {
                    this.clauses = res.filter(
                        x => x.policyId === this.risks[0].id
                    );
                });

                this.productClauseService
                    .getPolicyExtensions()
                    .subscribe(res => {
                        this.extensions = res.filter(
                            x => x.policyId === this.risks[0].id
                        );
                    });

                this.productClauseService.getPolicyWordings().subscribe(res => {
                    this.wordings = res.filter(
                        x => x.policyId === this.risks[0].id
                    );
                });

                this.displayQuote = this.quote;

                this.isQuoteApproved = this.quote.status === 'Approved';

                this.quotesLoading = false;

                // fill quotation details
                this.quoteDetailsForm
                    .get('client')
                    .setValue(this.quoteData.client);
                this.quoteDetailsForm
                    .get('currency')
                    .setValue(this.quoteData.currency);
                this.quoteDetailsForm
                    .get('sourceOfBusiness')
                    .setValue(this.quoteData.sourceOfBusiness, {
                        onlySelf: true
                    });
                this.quoteDetailsForm
                    .get('intermediaryName')
                    .setValue(this.quoteData.intermediaryName);

                if (this.quoteData.sourceOfBusiness === 'Agent') {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }
                if (this.quoteData.sourceOfBusiness === 'Broker') {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }
                if (
                    this.quoteData.sourceOfBusiness === 'Sales Representative'
                ) {
                    this.quoteDetailsForm
                        .get('intermediaryName')
                        .setValue(this.quoteData.intermediaryName);
                }

                this.quoteDetailsForm
                    .get('startDate')
                    .setValue(this.quoteData.startDate);
                this.quoteDetailsForm
                    .get('quarter')
                    .setValue(this.quoteData.quarter);
                this.quoteDetailsForm
                    .get('endDate')
                    .setValue(this.quoteData.endDate);

                this.numberOfRisks = this.risks.length;
                this.premiumLoadingTotal = 0;
            });

            this.clientsService.getAllClients().subscribe(clients => {
                this.clients = [...clients[0], ...clients[1]] as Array<
                    IIndividualClient & ICorporateClient
                >;
            });

            this.agentsService.getAgents().subscribe(agents => {
                this.agents = agents;
            });

            this.agentsService.getBrokers().subscribe(brokers => {
                this.brokers = brokers;
            });

            this.agentsService
                .getSalesRepresentatives()
                .subscribe(salesRepresentatives => {
                    this.salesRepresentatives = salesRepresentatives;
                });

            this.agentsService
                .getAllIntermediaries()
                .subscribe(intermediaries => {
                    this.intermediaries = [
                        ...intermediaries[0],
                        ...intermediaries[1],
                        ...intermediaries[2]
                    ] as Array<IAgent & IBroker & ISalesRepresentative>;
                });

            this.quoteDetailsForm = this.formBuilder.group({
                client: ['', Validators.required],
                startDate: ['', Validators.required],
                endDate: [''],
                currency: [`${this.quote.currency}`, Validators.required],
                branch: ['', Validators.required],
                product: ['', Validators.required],
                quarter: ['', Validators.required],
                underwritingYear: ['', Validators.required],
                sourceOfBusiness: ['', Validators.required],
                intermediaryName: ['', Validators.required]
            });

            this.excessesForm = this.formBuilder.group({
                collisionAndFire: ['', Validators.required],
                theftOfVehicleWithAntiTheftDevice: ['', Validators.required],
                theftOfVehicleWithoutAntiTheftDevice: ['', Validators.required],
                thirdPartyPropertyDamage: ['', Validators.required]
            });

            this.combinedLimitsForm = this.formBuilder.group({
                combinedLimits: ['', Validators.required],
                combinedLimitsPremium: ['', Validators.required],
                combinedLimitsRate: ['', Validators.required]
            });

            // set values for excesses
            this.excessesForm.get('collisionAndFire').setValue('500');
            this.excessesForm
                .get('theftOfVehicleWithAntiTheftDevice')
                .setValue('500');
            this.excessesForm
                .get('theftOfVehicleWithoutAntiTheftDevice')
                .setValue('500');
            this.excessesForm.get('thirdPartyPropertyDamage').setValue('500');

            this.policiesService.getPolicies().subscribe(policies => {
                this.policiesCount = policies.length;
            });
        });
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o2.value === o2.value : o1 === o2

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
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.quoteDetailsForm.get('startDate').value !== '' &&
            this.quoteDetailsForm.get('quarter').value !== ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.quoteDetailsForm.get('startDate').value,
                quarter: Number(this.quoteDetailsForm.get('quarter').value),
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
                    this.quoteDetailsForm.get('endDate').setValue(data.endDate);
                });
        }
    }

    // remove risk from risks table
    removeRisk(regNumber: string): void {
        this.risks = this.risks.filter(
            risk => risk.vehicle.regNumber !== regNumber
        );
    }

    // save risks changes after editing
    saveRisk(): void {
        this.currentRiskEdit = this.selectedRisk;
        console.log(this.currentRiskEdit);

        if (this.selectedValue.value === 'Comprehensive') {
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
                insuranceType: this.selectedValue.value
            };
            this.currentRiskEdit = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
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
                insuranceType: this.selectedValue.value
            };
            this.selectedRisk = some;

            const riskIndex = _.findIndex(this.risks, {
                id: this.selectedRisk.id
            });
            this.risks.splice(riskIndex, 1, this.currentRiskEdit);
        }

        this.isRiskDetailsEditmode = false;
    }

    // add risk to table
    addRisk() {
        const risk: RiskModel[] = [];
        const vehicleDetails = this.vehicleDetailsService.getVehicleDetails();
        const premimuComputations = this.premuimComputationsComponent.getPremiumComputations();
        const premiumComputationDetails = this.premiumComputationDetailsComponent.getPremiumComputationDetails();
        const extensionDetails = this.extensionsComponent.getExtensions();
        const discountDetails = this.discountsComponent.getDiscounts();
        const totals = this.totalsComponent.getTotals();

        risk.push({
            id: v4(),
            ...vehicleDetails,
            ...premimuComputations,
            ...premiumComputationDetails,
            ...extensionDetails,
            ...discountDetails,
            ...totals,
            limitsOfLiability: [],
            LiabilityType: '',
            excesses: []
        });

        this.risks = [...this.risks, ...risk];

        // // call a reset function..
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.viewRiskModalVisible = true;
        this.premiumComputationService.changeRiskEditMode(true);
        this.selectedRisk = risk;

        this.createQuoteComponent.viewRiskDetails(risk);
    }

    closeRiskDetails() {
        this.quoteRiskDetailsModalVisible = false;
    }

    handleOk(): void {
        console.log(this.quoteDetailsForm.value);
        // push to convert quote to policy and policies collection
        const policy = this.quoteDetailsForm.value as Policy;

        for (const clause of this.clauses) {
            clause.policyId = policy.id;
            this.productClauseService.updatePolicyClause(clause);
        }

        for (const extenstion of this.extensions) {
            extenstion.policyId = policy.id;
            this.productClauseService.updatePolicyExtension(extenstion);
        }

        for (const wording of this.wordings) {
            wording.policyId = policy.id;
            this.productClauseService.updatePolicyWording(wording);
        }

        this.policiesService.addPolicy(policy);
        this.isVisible = false;
        this.router.navigateByUrl('/flosure/underwriting/policies');
        this.isConfirmLoading = false;
    }



    handleCancel(): void {
        this.isVisible = false;
    }
    handleReceiptCancel() {
        this.isPlanVisible = false;
    }

    handleReceiptOk() {}
    showPaymentModal() {
        this.isPlanVisible = true;
    }

    generateDocuments(): void {
        // console.log('here>>>>>', this.quote.risks[0].insuranceType);
        this.amount = this.sumArray(this.quoteData.risks, 'netPremium');
        this.approvingQuote = true;

        if (this.quoteData.sourceOfBusiness !== 'Direct') {
            this.commissionAmount =
                (this.commission.commission / 100) *
                this.sumArray(this.quoteData.risks, 'netPremium');
        }

        // convert to policy
        const policy: Policy = {
            ...this.quoteDetailsForm.value,
            nameOfInsured: this.quoteData.client,
            clientCode: this.quoteData.clientCode,
            policyNumber: this.quoteNumber.replace('Q', 'P'),
            dateOfIssue: new Date(),
            expiryDate: this.quoteData.endDate,
            timeOfIssue: new Date(),
            // new Date().getHours() + ':' + new Date().getMinutes(),
            status: 'Active',
            receiptStatus: 'Unreceipted',
            risks: this.quoteData.risks,
            sumInsured: this.sumArray(this.quoteData.risks, 'sumInsured'),
            netPremium: this.sumArray(this.quoteData.risks, 'netPremium'),
            paymentPlan: 'NotCreated',
            underwritingYear: new Date(),
            user: Number(this.decodedJwtData.user_id),
            sourceOfBusiness: this.quoteData.sourceOfBusiness,
            intermediaryName: this.quoteData.intermediaryName,
            intermediaryId: this.quoteData.intermediaryId
        };

        if (this.quoteData.sourceOfBusiness !== 'Direct') {
            this.allocationPolicy = {
                balance:
                    Number(this.sumArray(this.quoteData.risks, 'netPremium')) -
                    Number(this.commissionAmount),
                client_id: this.quoteData.clientCode,
                client_name: this.quoteData.client,
                commission_due: Number(this.commissionAmount),
                commission_rate: Number(this.commission.commission),
                gross_amount: Number(
                    this.sumArray(this.quoteData.risks, 'netPremium')
                ),
                intermediary_id: this.quoteData.intermediaryId,
                intermediary_name: this.quoteData.intermediaryName,
                net_amount_due:
                    Number(this.sumArray(this.quoteData.risks, 'netPremium')) -
                    Number(this.commissionAmount),
                policy_number: this.quoteNumber.replace('Q', 'P'),
                settlements: 0,
                status: 'Un Allocated'
            };
        }

        const debitNote: DebitNote = {
            remarks: 'Policy creation',
            status: 'Pending',
            debitNoteAmount: Number(
                this.sumArray(this.quoteData.risks, 'netPremium')
            ),
            dateCreated: new Date(),
            dateUpdated: new Date()
        };

        const coverNote: CoverNote = {
            dateCreated: new Date(),
            dateUpdated: new Date()
        };

        const currentClassObj: IClass = JSON.parse(
            localStorage.getItem('classObject')
        );

        if (
            this.quote.risks[0].insuranceType === 'ThirdPartyFireAndTheft' ||
            'ThirdParty' ||
            'ActOnly'
        ) {
            this.getInsuranceType = this.quote.risks[0].insuranceType;

            this.submitted = true;

            // combineLatest().subscribe(async ([debit, cert]) => {
            this.quote.status = 'Approved';
            this.quotesService
                .updateMotorQuotation(this.quote, this.quote.id)
                .subscribe(quotation => res => console.log(res));

            this.policiesService.createPolicy(policy).subscribe(res => {
                console.log('response:', res);

                this.isQuoteApproved = true;
                this.approvingQuote = false;

                if (this.quoteData.sourceOfBusiness !== 'Direct') {
                    this.allocationService
                        .createAllocationPolicy(this.allocationPolicy)
                        .subscribe(
                            succ => {},
                            nSucc => {
                                this.message.error(nSucc);
                            }
                        );
                }

                this.policyId = res.id;
                this.newRisks = res.risks;
                console.log('Risks>>>>>>>>', this.newRisks);

                let insuranceType = '';
                const productType = this.getInsuranceType;
                if (productType === 'Comprehensive') {
                    insuranceType = 'MCP';
                } else {
                    insuranceType = 'THP';
                }

                for (const r of this.newRisks) {
                    let insuranceTypei = '';
                    const productTypei = r.insuranceType;
                    if (productTypei === 'Comprehensive') {
                        insuranceTypei = '07001';
                    } else {
                        insuranceType = '07002';
                    }
                    this.http
                        .get<any>(
                            `https://number-generation.flosure-api.com/savenda-certificate-number`
                        )
                        .subscribe(async resf => {
                            coverNote.certificateNumber =
                                resf.data.certificate_number;
                            coverNote.policyId = r.id;
                            console.log(
                                'Cover Note>>>>',
                                resf.data.certificate_number
                            );

                            this.http
                                .post<CoverNote>(
                                    `https://savenda.flosure-api.com/documents/cover-note`,
                                    coverNote
                                )
                                .subscribe(
                                    async resd => {
                                        console.log(resd);
                                    },
                                    async err => {
                                        console.log(err);
                                    }
                                );
                        });
                }

                this.http
                    .get<any>(
                        `https://number-generation.flosure-api.com/savenda-invoice-number/1/${currentClassObj.classCode}`
                    )
                    .subscribe(async resd => {
                        debitNote.debitNoteNumber = resd.data.invoice_number;


                        this.http
                            .post<DebitNote>(
                                `https://savenda.flosure-api.com/documents/debit-note/${this.policyId}`,
                                debitNote
                            )
                            .subscribe(
                                async (resh) => {

                                  this.debitNoteNumber = resh.id;

                                  this.clientsService.getTransactions().subscribe((txns: any) => {
                                    let balanceTxn = 0;
                                    console.log('DEDEDE', txns);
                                    const filterTxn = txns.data.filter((x) => x.client_id === this.quoteData.clientCode);

                                    if (filterTxn === null || filterTxn === undefined || filterTxn === [] || filterTxn.length === 0) {
                                      balanceTxn = Number((resh).debitNoteAmount);
                                    } else {
                                      this.transaction = filterTxn.slice(-1)[0];

                                      console.log('DEDEDE', this.transaction);

                                      balanceTxn = Number(this.transaction.balance) + Number((resh).debitNoteAmount);
                                    }


                                    const trans: TransactionModel = {
                                      balance: Number(balanceTxn),
                                      client_id: this.quoteData.clientCode,
                                      cr: 0,
                                      debit_note_id: this.debitNoteNumber,
                                      dr: Number((resh).debitNoteAmount),
                                      transaction_amount: Number((resh).debitNoteAmount),
                                      transaction_date: new Date(),
                                      type: 'Debit',
                                      reference: resd.data.invoice_number

                                    };

                                    this.clientsService.createTransaction(trans).subscribe((sucTxn) => {}, (errTxn) => {
                                      this.message.error(errTxn);
                                    });
                                  });
                                  console.log((resh));
                                },
                                async err => {
                                    console.log(err);
                                }
                            );
                    });

                for (const clause of this.clauses) {
                    clause.policyId = res.id;
                    this.productClauseService.updatePolicyClause(clause);
                }

                for (const extenstion of this.extensions) {
                    extenstion.policyId = res.id;
                    this.productClauseService.updatePolicyExtension(extenstion);
                }
                for (const wording of this.wordings) {
                    wording.policyId = res.id;
                    this.productClauseService.updatePolicyWording(wording);
                }

                for (const risk of policy.risks) {
                    if (
                        risk.insuranceType === 'ThirdParty' ||
                        'ActOnly' ||
                        'ThirdPartyFireAndTheft'
                    ) {
                        const params = {
                            insuranceType: 1,
                            status: 1,
                            registrationMark: risk.vehicle.regNumber.replace(
                                /\s/g,
                                ''
                            ),
                            dateFrom: risk.riskStartDate,
                            dateTo: risk.riskEndDate,
                            insurancePolicyNo: policy.policyNumber,
                            chassisNumber: risk.vehicle.chassisNumber
                        };

                        // this.quotesService.postRtsa(params);
                    } else if (risk.insuranceType === 'Comprehensive') {
                        const params = {
                            insuranceType: 2,
                            status: 1,
                            registrationMark: risk.vehicle.regNumber.replace(
                                /\s/g,
                                ''
                            ),
                            dateFrom: risk.riskStartDate,
                            dateTo: risk.riskEndDate,
                            insurancePolicyNo: policy.policyNumber,
                            chassisNumber: risk.vehicle.chassisNumber
                        };

                        // this.quotesService.postRtsa(params);
                    }
                }
            });

            // });

            // this.receiptForm.reset();
            // setTimeout(() => {
            //     this.isVisible = false;
            //     this.isOkLoading = false;
            // }, 3000);

            // this.generateID(this._id);
            // }
        } else if (this.quote.risks[0].insuranceType === 'Comprehensive') {
            this.getInsuranceType = this.quote.risks[0].insuranceType;

            this.submitted = true;

            this.quote.status = 'Approved';
            this.quotesService
                .updateMotorQuotation(this.quote, this.quote.id)
                .subscribe(quotation => res => console.log(res));

            this.policiesService.createPolicy(policy).subscribe(res => {
                if (this.quoteData.sourceOfBusiness !== 'Direct') {
                    this.allocationService
                        .createAllocationPolicy(this.allocationPolicy)
                        .subscribe(
                            succ => {},
                            nSucc => {
                                this.message.error(nSucc);
                            }
                        );
                }
                console.log('response:', res);

                this.isQuoteApproved = true;
                this.approvingQuote = false;

                this.policyId = res.id;

                let insuranceType = '';
                const productType = this.getInsuranceType;
                if (productType === 'Comprehensive') {
                    insuranceType = '07001';
                } else {
                    insuranceType = '07002';
                }

                this.http
                    .get<any>(
                        `https://number-generation.flosure-api.com/savenda-invoice-number/1/${currentClassObj.classCode}`
                    )
                    .subscribe(async resj => {
                        debitNote.debitNoteNumber = resj.data.invoice_number;

                        console.log('DEBITNOTE>>>>', resj.data.invoice_number);

                        this.http
                            .post<DebitNote>(
                                `https://savenda.flosure-api.com/documents/debit-note/${this.policyId}`,
                                debitNote
                            )
                            .subscribe(
                                async resk => {
                                  this.debitNoteNumber = resk.id;

                                  this.clientsService.getTransactions().subscribe((txns: any) => {
                                    let balanceTxn = 0;
                                    console.log('DEDEDE', txns);
                                    const filterTxn = txns.data.filter((x) => x.client_id === this.quoteData.clientCode);

                                    if (filterTxn === null || filterTxn === undefined || filterTxn === [] || filterTxn.length === 0) {
                                      balanceTxn = Number((resk).debitNoteAmount);
                                    } else {
                                      this.transaction = filterTxn[filterTxn.length - 1];


                                      console.log('TXNSNS>>>>>', filterTxn, this.transaction);

                                      console.log('DEDEDE', this.transaction);

                                      balanceTxn = Number(this.transaction.balance) + Number((resk).debitNoteAmount);
                                    }


                                    const trans: TransactionModel = {
                                      balance: Number(balanceTxn),
                                      client_id: this.quoteData.clientCode,
                                      cr: 0,
                                      debit_note_id: this.debitNoteNumber,
                                      dr: Number((resk).debitNoteAmount),
                                      transaction_amount: Number((resk).debitNoteAmount),
                                      transaction_date: new Date(),
                                      type: 'Debit',
                                      reference: resj.data.invoice_number

                                    };


                                    this.clientsService.createTransaction(trans).subscribe((sucTxn) => {}, (errTxn) => {
                                      this.message.error(errTxn);
                                    });
                                  });
                                  console.log(resk);
                                },
                                async err => {
                                    console.log(err);
                                }
                            );
                    });

                for (const clause of this.clauses) {
                    clause.policyId = res.id;
                    this.productClauseService.updatePolicyClause(clause);
                }

                for (const extenstion of this.extensions) {
                    extenstion.policyId = res.id;
                    this.productClauseService.updatePolicyExtension(extenstion);
                }

                for (const wording of this.wordings) {
                    wording.policyId = res.id;
                    this.productClauseService.updatePolicyWording(wording);
                }

                console.log(
                    'CLAUSE>>>>>>',
                    this.clauses,
                    this.extensions,
                    this.wordings
                );

                for (const risk of policy.risks) {
                    console.log('Risks>>>>', risk);

                    if (
                        risk.insuranceType === 'ThirdParty' ||
                        'ActOnly' ||
                        'ThirdPartyFireAndTheft'
                    ) {
                        const params = {
                            insuranceType: 1,
                            status: 1,
                            registrationMark: risk.vehicle.regNumber.replace(
                                /\s/g,
                                ''
                            ),
                            dateFrom: risk.riskStartDate,
                            dateTo: risk.riskEndDate,
                            insurancePolicyNo: policy.policyNumber,
                            chassisNumber: risk.vehicle.chassisNumber
                        };

                        console.log('PARAMS>>>>>>', params);

                        // this.quotesService.postRtsa(params);
                    } else if (risk.insuranceType === 'Comprehensive') {
                        const params = {
                            insuranceType: 2,
                            status: 1,
                            registrationMark: risk.vehicle.regNumber.replace(
                                /\s/g,
                                ''
                            ),
                            dateFrom: risk.riskStartDate,
                            dateTo: risk.riskEndDate,
                            insurancePolicyNo: policy.policyNumber,
                            chassisNumber: risk.vehicle.chassisNumber
                        };
                        console.log('PARAMS>>>>>>', params);

                        // this.quotesService.postRtsa(params);

                        console.log(
                            'Risk Type>>>>',
                            risk.insuranceType,
                            policy.policyNumber
                        );
                    }
                }
            });

            // });

            // this.receiptForm.reset();
            // setTimeout(() => {
            //     this.isVisible = false;
            //     this.isOkLoading = false;
            // }, 3000);

            // this.generateID(this._id);
            // }
        }
    }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    // filter by search
    search(value: string): void {
        if (value === '' || !value) {
            this.displayQuote = this.quote;
        }

        this.displayQuote.risks = this.quote.risks.filter(quote => {
            return (
                quote.insuranceType
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicle.regNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicle.chassisNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicle.vehicleMake
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicle.vehicleModel
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.vehicle.engineNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.productType.toLowerCase().includes(value.toLowerCase()) ||
                quote.vehicle.color.toLowerCase().includes(value.toLowerCase())
            );
        });
    }

    // import excel fleet methods
    showModal(): void {
        this.isVisible = true;
    }

    /// Draft quotation calculations
    handleDraftQuotation() {
        this.quoteLoadingTotal = 0;
        this.quoteDiscountTotal = 0;
        this.quoteSumInsured = this.sumArray(this.risks, 'sumInsured');
        this.quoteBasicPremium = this.sumArray(this.risks, 'basicPremium');
        this.quoteLevy = this.sumArray(this.risks, 'premiumLevy');
        this.quoteNetPremium = this.sumArray(this.risks, 'netPremium');

        for (const risk of this.risks) {
            this.quoteLoadingTotal += this.sumArray(risk.extensions, 'amount');
        }

        for (const risk of this.risks) {
            this.quoteDiscountTotal += this.sumArray(risk.discounts, 'amount');
        }

        console.log(localStorage.getItem('class'));
        if (localStorage.getItem('class') == 'Motor') {
            this.isViewDraftQuotePDFVisible = true;
        }
        if (localStorage.getItem('class') == 'Fire') {
            this.isViewFireDraftQuotePDFVisible = true;
        }
    }

    get receiptFormControl() {
        return this.receiptForm.controls;
    }

    paymentMethodChange(value) {
        this.paymentMethod = value;
    }

    generateID(id) {
        console.log('++++++++++++ID++++++++++++');
        this._id = id;
        console.log(this._id);
        this.router.navigateByUrl('/flosure/accounts/view-receipt/' + this._id);
    }
}
