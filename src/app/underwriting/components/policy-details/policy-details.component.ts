import {
    LiabilityType,
    LimitsOfLiability,
    Excess
} from './../../../quotes/models/quote.model';
import { RiskDetailsComponent } from './../../../quotes/components/risk-details/risk-details.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy, ITimestamp } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import {
    IPaymentModel,
    InstallmentsModel,
    PlanReceipt
} from 'src/app/accounts/components/models/payment-plans.model';
import { v4 } from 'uuid';
import { PaymentPlanService } from 'src/app/accounts/services/payment-plan.service';
import { AccountService } from 'src/app/accounts/services/account.service';
import { RiskModel, DiscountModel } from 'src/app/quotes/models/quote.model';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import {
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
    IExccess
} from 'src/app/settings/models/underwriting/clause.model';
import { DebitNote, CoverNote } from '../../documents/models/documents.model';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    IIndividualClient,
    ICorporateClient
} from 'src/app/clients/models/clients.model';
import { Risks } from 'src/app/reports/model/quotation.model';
import { IDiscounts } from 'src/app/quotes/models/discounts.model';
import { Subscription } from 'rxjs';
import { InsuranceClassHandlerService } from '../../services/insurance-class-handler.service';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';
import { UserModel } from '../../../users/models/users.model';
import { UsersService } from '../../../users/services/users.service';
import * as jwt_decode from 'jwt-decode';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss']
})
export class PolicyDetailsComponent implements OnInit, OnDestroy {
    classHandlerSubscription: Subscription;

    isVisible = false;
    policyDetailsForm: FormGroup;
    paymentPlanForm: FormGroup;
    policydata: Policy[] = [];

    clauses: IPolicyClauses[];
    wordings: IPolicyWording[];
    extensions: IPolicyExtension[];

    debitNotes: DebitNote[];
    singleDebitNote: DebitNote;
    latestDebitNote: DebitNote;

    // client details
    client: IIndividualClient & ICorporateClient;
    clientsList: Array<IIndividualClient & ICorporateClient>;

    policiesList: Policy[];
    policyNumber: string;
    policyData: Policy = new Policy();
    policy: Policy;
    displayPolicy: Policy;
    policyUpdate: Policy = new Policy();
    isLoading = false;
    isOkLoading = false;

    paymentPlan = 'NotCreated';

    // risks
    risks: RiskModel[] = [];
    risksLoading = true;

    searchString: string;

    isEditmode = false;

    selectedRisk: RiskModel = new RiskModel();
    selectedRisks: RiskModel[] = [];

    // PDFS
    isCertificatePDFVisible = false;
    isDebitNotePDFVisible = false;
    isSchedulePDFVisible = false;
    isClausesPDFVisible = false;
    isFirePolicySchedulePDFVisible = false;
    isFireCoverNotePDFVisible = false;

    isNewCertificatePdfVisible = false;
    isThirdPartyCertificatePdfVisible = false;
    isComprehensiveCertificatePdfVisible = false;

    isScheduleCombinedPDFVisible = false;

    // For Modal
    clientName = '';
    clientNumber = '';
    clientAddress = '';
    clientEmail = '';
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
    premiumLevy: string;

    // documents limits of liability
    deathAndInjuryPerPerson: number;
    deathAndInjuryPerEvent: number;
    propertyDamage: number;
    combinedLimits: number;

    // documents excesses
    below21Years: number;
    over70Years: number;
    noLicence: number;
    careLessDriving: number;
    otherEndorsement: number;

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' }
    ];
    selectedValue = 'fully';
    formattedDate: any;
    planId: string;
    // clientName: any;
    netPremium: any;
    formattedeDate: Date;
    excesses: any;

    _id: string;
    cnd: IDiscounts;
    cndAmount = 0;
    receipt: IReceiptModel;
    coverNote: CoverNote;
    coverNot: CoverNote;
    coverNotes: CoverNote[] = [];
    // tslint:disable-next-line: whitespace
    coverNotesRisks: any[] = [];
    selectedsRisks: RiskModel[];
    limitsOfLiablity: LimitsOfLiability[] = [];
    limitsOfLiablityCert: LimitsOfLiability[] = [];
    combAmount: number;
    combInfo: string;
    proDInfo: string;
    propDAmounts: number;
    deathPEInfo: string;
    deathPEAmount: number;
    deathPPInfo: string;
    deathPPAmount: number;

    fExcexxType = '';
    fExcessAmount = 0;
    sExcessType = '';
    sExcessAmount = 0;
    tExcessType = '';
    tExcessAmount = 0;


    excessList: IExccess[] = [];
    excessListCert: IExccess[] = [];

    currentClass: IClass;
    user: UserModel;
    loggedIn = localStorage.getItem('currentUser');

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private productClauseService: ClausesService,
        private clientsService: ClientsService,
        private classHandler: InsuranceClassHandlerService,
        private usersService: UsersService
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required]
        });

        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = currentClass;
            }
        );
    }

    ngOnInit(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isOkLoading = false;
        }, 3000);

        this.route.params.subscribe(id => {
            this.policiesService.getPolicyById(id.id).subscribe(policy => {
                this.policyData = policy;
                console.log('policy data:=> ', this.policyData);

                this.classHandler.changeSelectedClass(this.policyData.class);

                this.policiesService.getCoverNotes().subscribe(res => {
                    console.log('RESULT COVER>>>>', res);
                    this.coverNotes = res;

                    // tslint:disable-next-line: semicolon
                });


                const decodedJwtData = jwt_decode(this.loggedIn);

                this.usersService.getUsers().subscribe((users) => {
                this.user = users.filter((x) => x.ID === decodedJwtData.user_id)[0];
              });

                this.productClauseService.getPolicyClauses().subscribe(res => {
                    this.clauses = res.filter(
                        x => x.policyId === this.policyData.id
                    );
                });

                this.productClauseService
                    .getPolicyExtensions()
                    .subscribe(res => {
                        this.extensions = res.filter(
                            x => x.policyId === this.policyData.id
                        );
                    });

                this.productClauseService.getPolicyWordings().subscribe(res => {
                    this.wordings = res.filter(
                        x => x.policyId === this.policyData.id
                    );
                });

                this.policiesService.getDebitNotes().subscribe(debitNotes => {
                    this.debitNotes = debitNotes;

                    this.singleDebitNote = debitNotes.filter(
                        x => x.policy.id === this.policyData.id
                    )[0];

                    this.receiptService.getReciepts().subscribe(receipts => {
                        this.receipt = receipts.filter(
                            x =>
                                x.invoice_number ===
                                this.singleDebitNote.debitNoteNumber
                        )[0];
                    });
                });

                this.clientsService.getAllClients().subscribe(clients => {
                    this.clientsList = [...clients[0], ...clients[1]] as Array<
                        ICorporateClient & IIndividualClient
                    >;

                    this.client = this.clientsList.filter(
                        x => x.id === this.policyData.clientCode
                    )[0] as IIndividualClient & ICorporateClient;

                    this.clientNumber = this.client.phone;
                    this.clientEmail = this.client.email;
                    this.clientAddress = this.client.address;
                });

                this.risks = policy.risks;

                for (const ri of this.risks) {
                    if (ri.limitsOfLiability !== []) {
                        for (const lim of ri.limitsOfLiability) {
                            if (lim.liabilityType === 'combinedLimits') {
                                this.combAmount = lim.amount;
                                this.combInfo = 'Combined Limits';
                            }
                            if (lim.liabilityType === 'propertyDamage') {
                                this.combAmount = 0;
                                this.combInfo = '';
                                this.proDInfo =
                                    '(i) Third Party Limit for injury/ Death per person ZMW';
                                this.propDAmounts = lim.amount;
                            }
                            if (
                                lim.liabilityType === 'deathAndInjuryPerEvent'
                            ) {
                                this.combAmount = 0;
                                this.combInfo = '';
                                this.deathPEInfo =
                                    '(ii) Third party limit per Event';
                                this.deathPEAmount = lim.amount;
                            }
                            if (
                                lim.liabilityType === 'deathAndInjuryPerPerson'
                            ) {
                                this.combAmount = 0;
                                this.combInfo = '';
                                this.deathPPInfo =
                                    '(iii)Third Party Property Damage';
                                this.deathPPAmount = lim.amount;
                            }
                        }
                    }

                    // if (ri.excesses !== []) {
                    //     for (const ex of ri.excesses) {
                    //         if (
                    //             ex.excessType ===
                    //             'Third Party Property Damage (TPPD ) 10% Minimum'
                    //         ) {
                    //             this.fExcessAmount = ex.amount;
                    //             this.fExcexxType =
                    //                 'Third Party Property Damage (TPPD ) 10% Minimum';
                    //         }
                    //         if (ex.excessType === 'Own Damage 10% Minimum') {
                    //             this.sExcessAmount = ex.amount;
                    //             this.sExcessType = 'Own Damage 10% Minimum';
                    //         }
                    //         if (
                    //             ex.excessType === 'Theft Excess [15%] Minimum'
                    //         ) {
                    //             this.tExcessAmount = ex.amount;
                    //             this.tExcessType = 'Theft Excess [15%] Minimum';
                    //         }
                    //     }
                    // }
                }

                this.limitsOfLiablity = this.risks[0].limitsOfLiability;
                this.limitsOfLiablityCert = this.risks[0].limitsOfLiability;
                this.excessList = this.risks[0].excesses;
                this.excessListCert = this.risks[0].excesses;

                // this.discounts = risk.discounts;
                this.policiesService.getCoverNotes().subscribe(res => {
                    this.coverNotesRisks = this.coverNotesRisks.concat(
                        ...res,
                        ...this.risks
                    );

                    for (const r of this.risks) {
                        this.coverNot = res.filter(x => x.policyId === r.id)[0];
                    }
                });

                this.policyRisk = policy.risks[0];

                const doo = new Date(policy.endDate);
                const nd = new Date(
                    doo.getTime() - doo.getTimezoneOffset() * -60000
                );

                this.clientName = policy.client;

                this.agency = 'Direct'; // TODO: Track this guy too
                this.coverForm = policy.startDate.toString();
                this.coverTo = nd.toString();
                // this.basicPremium = this.policy
                this.loadingAmount = '-';
                this.discountAmount = '-';
                this.totalAmount = policy.netPremium.toString();
                this.issueDate = policy.dateOfIssue.toString();
                this.issueTime = policy.dateOfIssue.toString();
                this.premiumLevy = this.sumArray(
                    this.risks,
                    'premiumLevy'
                ).toString();
                this.basicPremium = this.sumArray(
                    this.risks,
                    'basicPremium'
                ).toString();

                // const doo = new Date(this.policyData.endDate);
                // const nd = new Date(
                //     doo.getTime() - doo.getTimezoneOffset() * -60000
                // );
                // set values of fields
                this.policyDetailsForm
                    .get('client')
                    .setValue(this.policyData.client);
                this.policyDetailsForm
                    .get('nameOfInsured')
                    .setValue(this.policyData.nameOfInsured);
                this.policyDetailsForm
                    .get('startDate')
                    .setValue(this.policyData.startDate);
                this.policyDetailsForm.get('endDate').setValue(nd);
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
                this.policyDetailsForm.get('expiryDate').setValue(nd);
                this.policyDetailsForm
                    .get('quarter')
                    .setValue(this.policyData.quarter);

                this.risksLoading = false;
            });
        });


        this.policyDetailsForm = this.formBuilder.group({
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
    }



    goToPoliciesList() {
        this.router.navigateByUrl('/flosure/underwriting/policies');
    }

    goToClientsList(): void {
        this.router.navigateByUrl('/flosure/clients/clients-list');
    }

    showModal(policy: Policy): void {
        this.isVisible = true;
    }

    handleOk(policyData): void {
        this.policyUpdate = policyData;
        if (this.selectedValue === 'plan') {
            let pAmount = 0;
            let policyCount = 0;
            const policyPlan: Policy[] = [];
            policyPlan.push({
                ...policyData
            });

            pAmount = pAmount + policyData.netPremium;
            policyCount++;

            this.clientName = policyData.client;
            this.netPremium = this.netPremium + policyData.netPremium;
            // this.policyPlan = policyPlan;
            this.policyUpdate.paymentPlan = 'Created';
            console.log(this.policyUpdate);
            this.policiesService
                .updatePolicy(this.policyUpdate)
                .subscribe(res => {
                    console.log('policy update>>>>', this.policyUpdate);
                });

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
                received_from: policyData.client,
                on_behalf_of: policyData.client,
                // receivedFrom: this.paymentPlanForm.controls.clientName.value,
                // onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                captured_by: this.user.ID,
                receipt_status: 'Receipted',
                narration: 'Payment Plan',
                receipt_type: 'Premium Payment',
                sum_in_digits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                today_date: new Date()
            };

            const planReceipt: PlanReceipt[] = [];
            planReceipt.push({
                allocation_status: 'Unallocated',
                amount: this.paymentPlanForm.controls.initialInstallmentAmount
                    .value
            });

            // plan.planReceipt = planReceipt;
            console.log('=====================');

            console.log(receipt, plan);

            // add payment plan
            // this.paymentPlanService.addPaymentPlanReceipt(receipt, plan);

            console.log('What is happening');
            // this.paymentPlanService.addPaymentPlan(plan);
            this.paymentPlanForm.reset();
            this.isVisible = false;
            this.router.navigateByUrl('flosure/accounts/payment-plan');
        } else if (this.selectedValue === 'fully') {
            this.policyUpdate.paymentPlan = 'Created';
            console.log(this.policyUpdate);
            this.policiesService
                .updatePolicy(this.policyUpdate)
                .subscribe(res => {
                    console.log('policy update>>>>', this.policyUpdate);
                });
            this.router.navigateByUrl('/flosure/accounts/receipts');
        }

        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    isCertificateVisible(risk: RiskModel) {
        this.selectedRisk = risk;

        this.isCertificatePDFVisible = true;
    }

    isNewCertificateVisible(risk: RiskModel) {
        this.selectedRisk = risk;



        if (localStorage.getItem('class') === 'Fire') {
            this.isFireCoverNotePDFVisible = true;
        }

        if (localStorage.getItem('class') === 'Motor') {
            if (this.selectedRisk.insuranceType === 'Comprehensive') {
                this.cnd = risk.discounts.filter(
                    x => x.discountType === 'No Claims Discount'
                )[0];

                this.coverNot = this.coverNotes.filter(
                    x => x.policyId === this.selectedRisk.id
                )[0];

                if (this.cnd === undefined) {
                    this.cndAmount = 0;
                } else {
                    this.cndAmount = Number(this.cnd.amount);
                }

                this.isComprehensiveCertificatePdfVisible = true;
                this.isThirdPartyCertificatePdfVisible = false;
            } else {
                this.coverNot = this.coverNotes.filter(
                    x => x.policyId === risk.id
                )[0];
                this.isComprehensiveCertificatePdfVisible = false;
                this.isThirdPartyCertificatePdfVisible = true;
            }
        }
    }

    isSchedule() {}

    sumArray(items, prop) {
        // tslint:disable-next-line: only-arrow-functions
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }

    openPolicySchedule() {


        if (localStorage.getItem('class') === 'Fire') {
            this.isFirePolicySchedulePDFVisible = true;
        }
        if (localStorage.getItem('class') === 'Motor') {
            this.isSchedulePDFVisible = true;
        }
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}
