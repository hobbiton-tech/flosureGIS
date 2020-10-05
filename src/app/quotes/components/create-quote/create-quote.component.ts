import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { PropertyDetailsModel } from '../../models/fire-class/property-details.model';
import { PropertyDetailsComponent } from '../fire-class/property-details/property-details.component';
import { FireClassService } from '../../services/fire-class.service';
import { Subscription } from 'rxjs';
import { InsuranceClassHandlerService } from 'src/app/underwriting/services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import * as jwt_decode from 'jwt-decode';
import { InsuranceClassService } from '../../services/insurance-class.service';
import { PermissionsModel } from 'src/app/users/models/roles.model';
import { UserModel } from 'src/app/users/models/users.model';
import { UsersService } from 'src/app/users/services/users.service';
import { AccidentClassService } from '../../services/accident-class.service';
import { IAccidentRiskDetailsModel } from '../../models/accident-class/accident-risk-details.model';
import { PersonalAccidentComponent } from '../accident-class/schedule-details/components/personal-accident/personal-accident.component';
import { IMarineRiskDetailsModel } from '../../models/marine-class/marine-risk-details.model';
import { AccidentProductDetailsComponent } from '../accident-class/accident-product-details/accident-product-details.component';
import { MarineProductDetailsComponent } from '../marine-class/marine-product-details/marine-product-details.component';
import { EngineeringProductDetailsComponent } from '../engineering-class/engineering-product-details/engineering-product-details.component';
import { IEngineeringRiskDetailsModel } from '../../models/engineering-class/engineering-risk-details.model';
import { MarineClassService } from '../../services/marine-class.service';
import { EngineeringClassService } from '../../services/engineering-class.service';

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
export class CreateQuoteComponent implements OnInit, OnDestroy {
    classHandlerSubscription: Subscription;
    addingQuoteStatusSubscription: Subscription;

    isCreatingQuote: boolean = false;

    // view risk modal
    viewRiskModalVisible = false;

    vehicle: VehicleDetailsModel;
    property: PropertyDetailsModel;

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

    currentClass: IClass;
    currentClassName: string;
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
        private propertyDetailsComponent: PropertyDetailsComponent,
        private premuimComputationsComponent: PremiumComputationComponent,
        private premiumComputationDetailsComponent: PremiumComputationDetailsComponent,
        private personalAccidentScheduleDetailsComponents: PersonalAccidentComponent,
        private extensionsComponent: ExtensionsComponent,
        private discountsComponent: DiscountsComponent,
        private totalsComponent: TotalsViewComponent,
        private vehicleDetailsService: VehicleDetailsServiceService,
        private limitsOfLiabilityComponent: LimitsOfLiabilityComponent,
        private excessesComponent: ExcessesComponent,
        private premiumComputationService: PremiumComputationService,
        private fireClassService: FireClassService,
        private accidentClassService: AccidentClassService,
        private marineClassService: MarineClassService,
        private engineeringClassService: EngineeringClassService,
        private classHandler: InsuranceClassHandlerService,
        private insuranceClassService: InsuranceClassService,
        private usersService: UsersService,
        private accidentProductDetailsComponent: AccidentProductDetailsComponent,
        private marineProductDetailsComponent: MarineProductDetailsComponent,
        private engineeringProductDetailsComponent: EngineeringProductDetailsComponent
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

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClassName = localStorage.getItem('class');
            }
        );

        this.addingQuoteStatusSubscription = this.insuranceClassService.isCreatingQuoteChanged$.subscribe(
            status => {
                this.isCreatingQuote = status;
            }
        );
    }

    // conditional render of agent field based on mode(agent or user)
    agentMode = false;

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
    vehicles: VehicleDetailsModel[] = [];
    properties: PropertyDetailsModel[] = [];
    accidentProducts: IAccidentRiskDetailsModel[] = [];
    marineProducts: IMarineRiskDetailsModel[] = [];
    engineeringProducts: IEngineeringRiskDetailsModel[] = [];

    // excesses
    excesses: Excess[] = [];

    // risk upload modal
    isVisible = false;
    isConfirmLoading = false;

    // close add risk panel
    isAddRiskPanelOpen: boolean;

    // set risk tamplate table not vivible
    isTabletemplate = true;

    // quoteNumber
    quoteNumber: string;

    selectedLoadingValue: IExtension;

    selectedSourceOfBusiness: string;

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;
    clientCode: any;
    clientName: any;
    concRisks: any[] = [];
    conChasis: any[] = [];

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            description: 'Increased Third Party Limit',
            heading: 'increasedThirdPartyLimits'
        };
    }

    ngOnInit(): void {
        this.decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', this.decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(
                x => x.ID === this.decodedJwtData.user_id
            )[0];

            this.isPresent = this.user.Permission.find(
                el =>
                    el.name === this.admin ||
                    el.name === this.approveQuote ||
                    el.name === this.editQuote ||
                    el.name === this.deleteRisk
            );

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
        });

        this.quoteForm = this.formBuilder.group({
            client: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            policyNumberOfDays: [''],
            endDate: [''],
            quarter: [''],
            user: [Number(this.decodedJwtData.user_id), Validators.required],
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

        this.quoteService.getVehicles().subscribe(vehicles => {
            this.vehicles.push(...vehicles);
        });

        this.quoteService.getProperties().subscribe(properties => {
            this.properties.push(...properties);
        });

        this.quoteService.getAccidentProducts().subscribe(products => {
            this.accidentProducts.push(...products);
        });

        this.quoteService.getMarineProducts().subscribe(products => {
            this.marineProducts.push(...products);
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
    };

    handlePolicyEndDateCalculation(): void {
        if (this.currentClassName.toLowerCase() != 'motor') {
            const startDate: Date = this.quoteForm.get('startDate').value;
            const endDate: Date = moment(startDate)
                .add('365', 'days')
                .toDate();

            this.quoteForm.get('endDate').setValue(endDate);
        }

        if (
            this.quoteForm.get('startDate').value !== '' &&
            this.quoteForm.get('quarter').value !== ''
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

    handleDatesCalculation(): void {
        let startDate = moment(this.quoteForm.get('startDate').value);
        let endDate = moment(this.quoteForm.get('endDate').value);
        let numberOfDays = endDate.diff(startDate, 'days');

        this.quoteForm.get('policyNumberOfDays').setValue(numberOfDays);
    }

    resetForms() {
        this.premiumComputationService.changeRiskEditMode(false);
    }

    // view details of the risk
    viewRiskDetails(risk: RiskModel) {
        console.log('RISK', risk);
        this.viewRiskModalVisible = true;

        this.quoteService.getVehicles().subscribe(vehicles => {
            this.vehicles.push(...vehicles);

            const vehicle: VehicleDetailsModel = this.vehicles.filter(
                x => x.risk.id == risk.id
            )[0];

            console.log('VEHICLE:=> ', vehicle);

            if (localStorage.getItem('class') == 'Motor') {
                this.vehicleDetailsComponent.setVehicleDetails(vehicle);
            }
        });

        this.quoteService.getProperties().subscribe(properties => {
            this.properties.push(...properties);

            const property: PropertyDetailsModel = this.properties.filter(
                x => x.risk.id == risk.id
            )[0];

            if (localStorage.getItem('class') == 'Fire') {
                this.propertyDetailsComponent.setPropertyDetails(property);
            }
        });

        this.quoteService.getAccidentProducts().subscribe(products => {
            this.accidentProducts.push(...products);

            const product: IAccidentRiskDetailsModel = this.accidentProducts.filter(
                x => x.risk.id == risk.id
            )[0];

            console.log('PRODUCT :=> ', product);

            if (localStorage.getItem('class') == 'Accident') {
                this.accidentProductDetailsComponent.setAccidentProductDetails(
                    product
                );
            }
        });

        this.quoteService.getMarineProducts().subscribe(products => {
            this.marineProducts.push(...products);

            const product: IMarineRiskDetailsModel = this.marineProducts.filter(
                x => x.risk.id == risk.id
            )[0];

            if (localStorage.getItem('class') == 'Marine') {
                this.marineProductDetailsComponent.setMarineProductDetails(
                    product
                );
            }
        });

        this.quoteService.getEngineeringProducts().subscribe(products => {
            this.engineeringProducts.push(...products);

            const product: IEngineeringRiskDetailsModel = this.engineeringProducts.filter(
                x => x.risk.id == risk.id
            )[0];

            if (localStorage.getItem('class') == 'Engineering') {
                this.engineeringProductDetailsComponent.setEngineeringProductDetails(
                    product
                );
            }
        });

        this.selectedRisk = risk;

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

        this.premiumComputationDetailsComponent.setPremiumComputationDetails(
            premiumComputationDetails
        );

        this.premuimComputationsComponent.setPremiumComputations(
            premimuComputations
        );
        this.totalsComponent.setTotals(totals);

        this.excessesComponent.setExcesses(risk.excesses);

        risk.extensions.forEach(extension => {
            this.premiumComputationService.addExtension(
                extension.extensionType,
                extension.amount
            );
        });

        risk.discounts.forEach(discount => {
            this.premiumComputationService.addDiscount(
                discount.discountType,
                discount.amount
            );
        });
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
        const index = _.findIndex(this.risks, { id: this.selectedRisk.id });

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

        this.risks.splice(index, 1, risk);

        this.risks = this.risks;
    }

    deleteRow(): void {}

    async addQuote(): Promise<void> {
        this.isCreatingQuote = true;

        this.clientCode = this.quoteForm.controls.client.value.id;
        if (this.quoteForm.controls.client.value.clientType === 'Individual') {
            this.clientName =
                this.quoteForm.controls.client.value.firstName +
                ' ' +
                this.quoteForm.controls.client.value.lastName;
        } else {
            this.clientName = this.quoteForm.controls.client.value.companyName;
        }

        let intermediaryNameA = '';
        const intType = this.quoteForm.controls.intermediaryName.value
            .intermediaryType;

        if (intType === 'Broker' || intType === 'Agent') {
            intermediaryNameA = this.quoteForm.controls.intermediaryName.value
                .companyName;
        } else {
            intermediaryNameA =
                this.quoteForm.controls.intermediaryName.value.firstName +
                ' ' +
                this.quoteForm.controls.intermediaryName.value.lastName;
        }

        const intermediaryIdA = this.quoteForm.controls.intermediaryName.value
            .id;

        const quote: MotorQuotationModel = {
            // ...this.quoteForm.value,
            currency: this.quoteForm.controls.currency.value,
            startDate: this.quoteForm.controls.startDate.value,
            messageCode: this.quoteForm.controls.messageCode.value,
            endDate: this.quoteForm.controls.endDate.value,
            quarter: this.quoteForm.controls.quarter.value,
            status: 'Draft',
            receiptStatus: 'Unreceipted',
            sourceOfBusiness: this.quoteForm.controls.sourceOfBusiness.value,
            intermediaryName: intermediaryNameA,
            intermediaryId: intermediaryIdA,
            dateCreated: new Date(),
            clientCode: this.clientCode,
            client: this.clientName,
            coverCode: '',
            underwritingYear: new Date(),
            branch: '',
            basicPremiumSubTotal: 0,
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : this.decodedJwtData.user_id,
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

        this.quoteService.createMotorQuotation(
            quote,
            this.vehicles,
            this.properties,
            this.accidentProducts,
            this.marineProducts,
            this.engineeringProducts
        );

        // this.isCreatingQuote = false;
    }

    changeIsCreatingQuoteStatus() {
        this.isCreatingQuote = false;
    }

    showModal(): void {
        this.isVisible = true;
    }

    // Add risk validation
    validateriskComprehensiveFormDetails() {}

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

        const vehicleDetails = this.vehicleDetailsService.getVehicleFormDetails();
        console.log('add vehicle:=> ', vehicleDetails);

        const propertyDetails = this.fireClassService.getPropertyFormDetails();
        console.log('add property:=> ', propertyDetails);

        const accidentProductDetails = this.accidentClassService.getAccidentFormDetails();
        console.log('add accident:=> ', accidentProductDetails);

        const marineProductDetails = this.marineClassService.getMarineFormDetails();
        console.log('add marine:=> ', marineProductDetails);

        const engineeringProductDetails = this.engineeringClassService.getEngineeringFormDetails();
        console.log('add engineering:=> ', engineeringProductDetails);

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
            ...premimuComputations,
            ...premiumComputationDetails,
            ...extensionDetails,
            ...discountDetails,
            ...totals,
            limitsOfLiability,
            LiabilityType: liabilityType,
            excesses
        });

        if (localStorage.getItem('class') == 'Motor') {
            this.vehicles.push({
                id: v4(),
                ...vehicleDetails,
                risk: risk[0]
            });
        }

        if (localStorage.getItem('class') == 'Fire') {
            this.properties.push({
                id: v4(),
                ...propertyDetails,
                risk: risk[0]
            });
        }

        if (localStorage.getItem('class') == 'Accident') {
            this.accidentProducts.push({
                id: v4(),
                ...accidentProductDetails,
                risk: risk[0],
                personalAccidentSchedule: this.personalAccidentScheduleDetailsComponents.getPersonalAccidentScheduleDetails()
            });
        }

        if (localStorage.getItem('class') == 'Marine') {
            this.marineProducts.push({
                id: v4(),
                ...marineProductDetails,
                risk: risk[0]
            });
        }

        if (localStorage.getItem('class') == 'Engineering') {
            this.engineeringProducts.push({
                id: v4(),
                ...engineeringProductDetails,
                risk: risk[0]
            });
        }

        this.risks = [...this.risks, ...risk];

        this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();

        // this.vehicleDetailsService.changeVehicleDetails(
        //     this.vehicleDetailsService.getVehicleDetails()
        // );

        this.isAddRiskPanelOpen = false;
    }

    resetRiskDetails() {
        // this.vehicleDetailsService.resetVehicleDetails();
        this.premiumComputationService.resetRiskDetails();
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
        this.addingQuoteStatusSubscription.unsubscribe();
    }
}
