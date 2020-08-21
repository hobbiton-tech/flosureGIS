import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    ICorporateClient,
    IIndividualClient
} from 'src/app/clients/models/clients.model';
import {
    RiskModel,
    MotorQuotationModel,
    Excess
} from '../../models/quote.model';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { v4 } from 'uuid';
import _ from 'lodash';
import {
    IBroker,
    ISalesRepresentative,
    IAgent
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import {
    IClause,
    IWording,
    IExtension,
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
    IExccess
} from 'src/app/settings/models/underwriting/clause.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import * as moment from 'moment';
import { SourceOfBusinessOptions } from '../../selection-options';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { VehicleDetailsComponent } from '../vehicle-details/vehicle-details.component';
import { PremiumComputationComponent } from '../premium-computation/premium-computation.component';
import { PremiumComputationDetailsComponent } from '../premium-computation-details/premium-computation-details.component';
import { ExtensionsComponent } from '../extensions/extensions.component';
import { DiscountsComponent } from '../discounts/discounts.component';
import { TotalsViewComponent } from '../totals-view/totals-view.component';
import { IExtensions } from '../../models/extensions.model';
import { VehicleDetailsServiceService } from '../../services/vehicle-details-service.service';
import { VehicleDetailsModel } from '../../models/vehicle-details.model';
import {
    PremiumComputationDetails,
    PremiumComputation
} from '../../models/premium-computations.model';
import { ITotalsModel } from '../../models/totals.model';
import { LimitsOfLiabilityComponent } from '../limits-of-liability/limits-of-liability.component';
import { ExcessesComponent } from '../excesses/excesses.component';
import { PremiumComputationService } from '../../services/premium-computation.service';

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

interface IQuoteNumberResult {
    resultQuoteNumber: string;
}

@Component({
    selector: 'app-create-quote',
    templateUrl: './create-quote.component.html',
    styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
    // view risk modal
    viewRiskModalVisible = false;

    // motorComprehensiveloadingOptions = MotorComprehensiveLoadingOptions;
    motorComprehensiveloadingOptions = [];
    // motorThirdPartyloadingOptions = MotorThirdPartyLoadingOptions;
    motorThirdPartyloadingOptions = [];
    sourceOfBusinessOptions = SourceOfBusinessOptions;

    // Excess Variable
    excessList: IExccess[] = [];

    excessTHP: IExccess[] = [];
    excessAct: IExccess[] = [];
    excessFT: IExccess[] = [];

    // loading feedback
    creatingQuote = false;
    quotesList: MotorQuotationModel[];
    displayQuotesList: MotorQuotationModel[];
    quotesCount = 0;
    lastItem: any;

    clauseList: IClause[] = [];
    wordingList: IWording[] = [];
    extensionList: IExtensions[] = [];
    PolicyClause: any[] = [];
    PolicyWording: any[] = [];
    PolicyExtension: any[] = [];
    selectedClauseValue: any[] = [];
    // isClauseEditVisible = false;
    selectedExtensionValue: any[] = [];
    isExtensionEditVisible = false;
    selectedWordingValue: any[] = [];
    selectedWarrantyValue: any[] = [];
    selectedExclusionValue: any[] = [];
    // isWordingEditVisible = false;
    // editClause: any;
    editExtension: any;
    // editWording: any;
    editCache: { [key: string]: { edit: boolean; data: IWording } } = {};

    newClauseWording: IPolicyClauses;
    newWordingWording: IPolicyWording;
    newExtensionWording: IPolicyExtension;

    // clauseForm: FormGroup;
    extensionForm: FormGroup;
    // wordingForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private readonly quoteService: QuotesService,
        private readonly clientsService: ClientsService,
        private msg: NzMessageService,
        private http: HttpClient,
        private readonly agentsService: AgentsService,
        private productClauseService: ClausesService,
        private policyService: PoliciesService,
        private vehicleDetailsComponent: VehicleDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private limitsOfLiabilityComponent: LimitsOfLiabilityComponent,
        private excessesComponent: ExcessesComponent,
        private premiumComputationService: PremiumComputationService
    ) {
        // this.clauseForm = formBuilder.group({
        //     heading: ['', Validators.required],
        //     clauseDetails: ['', Validators.required],
        // });
        this.extensionForm = formBuilder.group({
            heading: ['', Validators.required],
            description: ['', Validators.required]
        });
        // this.wordingForm = formBuilder.group({
        //     heading: ['', Validators.required],
        //     description: ['', Validators.required],
        // });
    }

    // conditional render of agent field based on mode(agent or user)
    agentMode = false;
    switchLoading = false;

    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computePremiumIsLoading = false;
    handleDiscountIsLoading = false;

    addLoadIsLoading = false;

    motor: any;
    quoteForm: FormGroup;
    excessesForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;
    premiumLoadingForm: FormGroup;

    // selected insurance type value
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    // intermediaries
    brokers: IBroker[];
    agents: IAgent[];
    salesRepresentatives: ISalesRepresentative[];

    // selected risk in risk table
    selectedRisk: RiskModel;

    // risk being edited
    currentRiskEdit: RiskModel;

    risks: RiskModel[] = [];

    // excesses
    excesses: Excess[] = [];

    // risk upload modal
    isVisible = false;
    isConfirmLoading = false;

    // close add risk panel
    isAddRiskPanelOpen: boolean;

    // Edit risk details
    isRiskDetailsEditmode = false;

    lossOfKeysAmount: number;
    maliciousDamageAmount: number;
    medicalExpensesAmount: number;
    injuryAndDeathAmount: number;
    propertyDamageAmount: number;
    earthquakeAmount: number;
    explosionsAmount: number;
    financialLossAmount: number;
    fireAndAlliedPerilsAmount: number;
    legalExpensesAmount: number;
    landslideAmount: number;
    passengerLiabilityAmount: number;
    permanentDisabilityAmount: number;

    todayYear = null;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // quoteNumber
    quoteNumber: string;

    selectedLoadingValue: IExtension;

    // motor third party rates
    motorThirdPartyRates = {
        pirvate: { Q1: 165, Q2: 280, Q3: 370, Q4: 464 },
        commercial: { Q1: 199, Q2: 340, Q3: 452, Q4: 566 },
        'bus/taxi': { Q1: 270, Q2: 464, Q3: 618, Q4: 772 }
    };

    selectedSourceOfBusiness: string;

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;
    clientCode: any;
    clientName: any;
    concRisks: any[] = [];
    conChasis: any[] = [];

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            description: 'Increased Third Party Limit',
            heading: 'increasedThirdPartyLimits'
        };
    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    }

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    }

    ngOnInit(): void {
        const user = localStorage.getItem('user');
        this.quoteForm = this.formBuilder.group({
            client: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            policyNumberOfDays: [''],
            endDate: [''],
            quarter: ['', Validators.required],
            user: [user, Validators.required],
            status: ['Draft'],
            receiptStatus: ['Unreceipted'],
            sourceOfBusiness: ['', Validators.required],
            intermediaryName: ['']
        });

        this.policyService.getPolicies().subscribe(res => {
            for (const policy of res) {
                this.concRisks = this.concRisks.concat(policy.risks);
            }
        });

        this.quoteService.getMotorQuotations().subscribe(quotes => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;

            this.displayQuotesList = this.quotesList;

            this.lastItem = this.quotesList[this.quotesList.length - 1];
        });

        this.clientsService.getAllClients().subscribe(clients => {

            this.clients = [...clients[0], ...clients[1]] as Array<
                IIndividualClient & ICorporateClient
            >;

            console.log('Client List>>>', this.clients);
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

        this.excessesForm = this.formBuilder.group({
            below21Years: ['', Validators.required],
            over70Years: ['', Validators.required],
            noLicence: ['', Validators.required],
            careLessDriving: ['', Validators.required],
            otherEndorsement: ['', Validators.required]
        });

        // set defaults values for excesses
        this.excessesForm.get('below21Years').setValue('100');
        this.excessesForm.get('over70Years').setValue('100');
        this.excessesForm.get('noLicence').setValue('120');
        this.excessesForm.get('careLessDriving').setValue('120');
        this.excessesForm.get('otherEndorsement').setValue('100');

        this.productClauseService.getClauses().subscribe(res => {
            this.clauseList = res;
        });

        this.productClauseService.getExtensions().subscribe(res => {
            this.extensionList = res;
            this.motorComprehensiveloadingOptions = res;
            this.motorThirdPartyloadingOptions = res.filter(
                x => x.extensionType === 'increasedThirdPartyLimits'
            );
        });

        this.productClauseService.getWordings().subscribe(res => {
            this.wordingList = res;
        });

        this.updateEditCache();
    }

    disabledSubmissionDate = submissionValue => {
        if (!submissionValue) {
            return false;
        }
        return submissionValue.valueOf() < moment().add(-1, 'days');
    }

    handlePolicyEndDateCalculation(): void {
        if (
            this.quoteForm.get('startDate').value != '' &&
            this.quoteForm.get('quarter').value != ''
        ) {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate: this.quoteForm.get('startDate').value,
                quarter: Number(this.quoteForm.get('quarter').value),
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
                    const doo = new Date(data.endDate);
                    const nd = new Date(
                        doo.getTime() - doo.getTimezoneOffset() * -60000
                    );
                    this.quoteForm.get('endDate').setValue(nd);

                    const startDate = moment(
                        this.quoteForm.get('startDate').value
                    );
                    const endDate = moment(nd);
                    const numberOfDays = endDate.diff(startDate, 'days');
                    this.quoteForm
                        .get('policyNumberOfDays')
                        .setValue(numberOfDays);
                });
        }
    }

    resetForms() {
        this.premiumComputationService.changeRiskEditMode(false);
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
    removeRisk(riskk: RiskModel): void {
        // this.risks = this.risks.filter(risk => risk.id !== riskk.id);
        this.risks = _.filter(this.risks, risk => {
            return risk.id !== riskk.id;
        });
    }

    // save risks changes after editing
    saveRisk(): void {
        console.log('save risk 2 called');
        const index = _.findIndex(this.risks, { id: this.selectedRisk.id });
        console.log('index:', index);

        const vehicleDetails = this.vehicleDetailsService.getVehicleDetails();
        const premimuComputations = this.premuimComputationsComponent.getPremiumComputations();
        const premiumComputationDetails = this.premiumComputationDetailsComponent.getPremiumComputationDetails();
        const extensionDetails = this.extensionsComponent.getExtensions();
        const discountDetails = this.discountsComponent.getDiscounts();
        const totals = this.totalsComponent.getTotals();

        const risk: RiskModel = {
            id: this.selectedRisk.id,
            ...vehicleDetails,
            ...premimuComputations,
            ...premiumComputationDetails,
            ...extensionDetails,
            ...discountDetails,
            ...totals,
            limitsOfLiability: [],
            LiabilityType: 'combinedLimits',
            excesses: []
        };

        console.log('risk');
        console.log(risk);

        this.risks.splice(index, 1, risk);
        console.log(this.risks);

        this.risks = this.risks;
    }

    deleteRow(): void {}

    async addQuote(): Promise<void> {
        this.creatingQuote = true;
        this.clientCode = this.quoteForm.controls.client.value.id;
        if (this.quoteForm.controls.client.value.clientType === 'Individual') {
            this.clientName =
                this.quoteForm.controls.client.value.firstName +
                ' ' +
                this.quoteForm.controls.client.value.lastName;
        } else {
            this.clientName = this.quoteForm.controls.client.value.companyName;
        }
        console.log('Client Details>>>>>>', this.clientCode, this.clientName);
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            dateCreated: new Date(),
            clientCode: this.clientCode,
            client: this.clientName,
            coverCode: '',
            underwritingYear: new Date(),
            branch: '',
            basicPremiumSubTotal: '',
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : localStorage.getItem('user'),
            risks: this.risks
        };

        // postgres
        for (const clause of this.selectedClauseValue) {
            this.newClauseWording = {
                ...clause,
                id: v4(),
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyClause(this.newClauseWording);
        }

        for (const extension of this.selectedExtensionValue) {
            this.newExtensionWording = {
                ...extension,
                id: v4(),
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyExtension(
                this.newExtensionWording
            );
        }

        for (const wording of this.selectedWordingValue) {
            this.newWordingWording = {
                ...wording,
                id: v4(),
                policyId: this.risks[0].id
            };
            this.productClauseService.addPolicyWording(this.newWordingWording);
        }

        await this.quoteService.createMotorQuotation(quote, this.quotesCount);
        this.creatingQuote = false;
    }

    showModal(): void {
        this.isVisible = true;
    }

    // Add risk validation
    validateriskComprehensiveFormDetails() {
        // if (this.riskComprehensiveForm.valid) {
        //     if (
        //         (this.sumInsured && this.sumInsured !== 0) ||
        //         (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
        //     ) {
        //         if (
        //             (this.premiumRate && this.premiumRate !== 0) ||
        //             (this.basicPremiumAmount && this.basicPremiumAmount !== 0)
        //         ) {
        //             if (this.netPremium > 0) {
        //                 return true;
        //             }
        //         }
        //     }
        // }
    }

    onEditExtension(value) {
        this.editExtension = value;

        this.extensionForm.get('heading').setValue(this.editExtension.heading);
        this.extensionForm
            .get('description')
            .setValue(this.editExtension.description);
        this.isExtensionEditVisible = true;
    }

    handleEditExtensionOk() {
        this.editExtension.heading = this.extensionForm.controls.heading.value;
        this.editExtension.description = this.extensionForm.controls.description.value;

        const index = this.selectedExtensionValue.indexOf(this.editExtension);
        this.selectedExtensionValue[index] = this.editExtension;
        this.isExtensionEditVisible = false;
    }
    handleEditExtensionCancel() {
        this.isExtensionEditVisible = false;
    }

    startEdit(id: string): void {
        this.editCache[id].edit = true;
    }

    cancelEdit(id: string): void {
        const index = this.selectedWordingValue.findIndex(
            item => item.id === id
        );
        this.editCache[id] = {
            data: { ...this.selectedWordingValue[index] },
            edit: false
        };
    }

    saveEdit(id: string): void {
        const index = this.selectedWordingValue.findIndex(
            item => item.id === id
        );
        Object.assign(
            this.selectedWordingValue[index],
            this.editCache[id].data
        );
        this.editCache[id].edit = false;
    }

    updateEditCache(): void {
        this.selectedWordingValue.forEach(item => {
            this.editCache[item.id] = {
                edit: false,
                data: { ...item }
            };
        });
    }

    addExcesses(): void {
        if (this.selectedValue.value === 'Comprehensive') {
            for (const ex of this.excessList) {
                this.excesses.push({
                    excessType: ex.description,
                    amount: Number(ex.amount)
                });
            }
        } else if (this.selectedValue.value === 'ThirdParty') {
            for (const exTHP of this.excessTHP) {
                this.excesses.push({
                    excessType: exTHP.description,
                    amount: Number(exTHP.amount)
                });
            }
        }
    }

    clauseSelected($event) {
        this.selectedClauseValue = $event;
    }

    wordingSelected($event) {
        this.selectedWordingValue = $event;
    }

    warrantySelected($event) {
        this.selectedWarrantyValue = $event;
    }

    exclusionSelected($event) {
        this.selectedExclusionValue = $event;
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
        const limitsOfLiability = this.limitsOfLiabilityComponent.getLimitsOfLiability();
        const liabilityType = this.limitsOfLiabilityComponent.getLiabilityType();
        const excesses = this.excessesComponent.getExcesses(
            this.premiumComputationDetailsComponent.getPremiumComputationDetails()
                .insuranceType
        );

        risk.push({
            id: v4(),
            ...vehicleDetails,
            ...premimuComputations,
            ...premiumComputationDetails,
            ...extensionDetails,
            ...discountDetails,
            ...totals,
            limitsOfLiability,
            LiabilityType: liabilityType,
            excesses
        });
        this.risks = [...this.risks, ...risk];

        this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();

        this.vehicleDetailsService.changeVehicleDetails(
            this.vehicleDetailsService.getVehicleDetails()
        );

        this.isAddRiskPanelOpen = false;
    }

    resetRiskDetails() {
        this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();
    }
}
