import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy, ITimestamp } from '../../models/policy.model';
import { PoliciesService } from '../../services/policies.service';
import {
    IPaymentModel,
    InstallmentsModel,
    PlanReceipt,
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
} from 'src/app/settings/models/underwriting/clause.model';
import { DebitNote, CoverNote } from '../../documents/models/documents.model';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    IIndividualClient,
    ICorporateClient,
} from 'src/app/clients/models/clients.model';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss'],
})
export class PolicyDetailsComponent implements OnInit {
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

    //client details
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

    // PDFS
    isCertificatePDFVisible = false;
    isDebitNotePDFVisible = false;
    isSchedulePDFVisible = false;
    isClausesPDFVisible = false;
    isWordingsPDFVisible = false;

    isNewCertificatePdfVisible = false;
    isThirdPartyCertificatePdfVisible = false;
    isComprehensiveCertificatePdfVisible = false;

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

    //documents limits of liability
    deathAndInjuryPerPerson: number;
    deathAndInjuryPerEvent: number;
    propertyDamage: number;
    combinedLimits: number;

    //documents excesses
    below21Years: number;
    over70Years: number;
    noLicence: number;
    careLessDriving: number;
    otherEndorsement: number;

    optionList = [
        { label: 'Full Payment', value: 'fully' },
        { label: 'Payment Plan', value: 'plan' },
    ];
    selectedValue = 'fully';
    formattedDate: any;
    planId: string;
    // clientName: any;
    netPremium: any;
    formattedeDate: Date;
    _;
    _id: string;
    cnd: DiscountModel;
    cndAmount = 0;
    receipt: IReceiptModel;
    coverNote: CoverNote;
    coverNot: CoverNote;
    coverNotes: CoverNote[] = [];
    coverNotesRisks: any[] = [];

    constructor(
        private readonly router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private policiesService: PoliciesService,
        private paymentPlanService: PaymentPlanService,
        private receiptService: AccountService,
        private productClauseService: ClausesService,
        private clientsService: ClientsService
    ) {
        this.paymentPlanForm = this.formBuilder.group({
            numberOfInstallments: ['', Validators.required],
            startDate: ['', Validators.required],
            initialInstallmentAmount: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isOkLoading = false;
        }, 3000);
        this.route.params.subscribe((id) => {
            this.policiesService.getPolicyById(id.id).subscribe((policy) => {
                console.log('CHECKING ID GET', policy);
                this.policyData = policy;

                this.policiesService.getCoverNotes().subscribe((res) => {
                    console.log('RESULT COVER>>>>', res);
                    this.coverNotes = res;
                });

                this.productClauseService
                    .getPolicyClauses()
                    .subscribe((res) => {
                        this.clauses = res.filter(
                            (x) => x.policyId === this.policyData.id
                        );
                    });

                this.productClauseService
                    .getPolicyExtensions()
                    .subscribe((res) => {
                        this.extensions = res.filter(
                            (x) => x.policyId === this.policyData.id
                        );
                    });

                this.productClauseService
                    .getPolicyWordings()
                    .subscribe((res) => {
                        this.wordings = res.filter(
                            (x) => x.policyId === this.policyData.id
                        );
                    });

                this.policiesService.getDebitNotes().subscribe((debitNotes) => {
                    this.debitNotes = debitNotes;

                    console.log('debit notes');
                    console.log(this.debitNotes);

                    console.log('id: ', this.policyData.id);

                    this.singleDebitNote = debitNotes.filter(
                        (x) => x.policy.id === this.policyData.id
                    )[0];

                    this.receiptService.getReciepts().subscribe((receipts) => {
                        this.receipt = receipts.filter(
                            (x) =>
                                x.invoiceNumber ===
                                this.singleDebitNote.debitNoteNumber
                        )[0];
                        console.log('RECEIPTS>>>>>', this.receipt);
                    });

                    console.log('Policy Debit Note:');
                    console.log(this.singleDebitNote);
                });

                this.clientsService.getAllClients().subscribe((clients) => {
                    this.clientsList = [...clients[0], ...clients[1]] as Array<
                        ICorporateClient & IIndividualClient
                    >;

                    console.log('clients: ');
                    console.log(clients);

                    this.client = this.clientsList.filter(
                        (x) => x.id === this.policyData.clientCode
                    )[0] as IIndividualClient & ICorporateClient;

                    console.log('HERE =>>>>>', this.client);
                    this.clientNumber = this.client.phone;
                    this.clientEmail = this.client.email;
                    this.clientAddress = this.client.address;

                    // console.log('policy data client:');
                    // console.log(this.policyData.client);

                    // console.log('client');
                    // console.log(this.client);
                });

                this.risks = policy.risks;
                // this.discounts = risk.discounts;
                this.policiesService.getCoverNotes().subscribe((res) => {
                    this.coverNotesRisks = this.coverNotesRisks.concat(
                        ...res,
                        ...this.risks
                    );
                    console.log('COMBINE>>>>', this.coverNotesRisks);

                    for (const r of this.risks)
                        this.coverNot = res.filter(
                            (x) => x.policyId === r.id
                        )[0];
                });

                this.policyRisk = policy.risks[0];
                // this.loading =

                //limits Of Liability
                this.deathAndInjuryPerPerson = policy.risks[0].limitsOfLiability.filter(
                    (x) => x.liabilityType === 'deathAndInjuryPerPerson'
                )[0].amount;
                this.deathAndInjuryPerEvent = policy.risks[0].limitsOfLiability.filter(
                    (x) => x.liabilityType === 'deathAndInjuryPerEvent'
                )[0].amount;
                this.propertyDamage = policy.risks[0].limitsOfLiability.filter(
                    (x) => x.liabilityType === 'propertyDamage'
                )[0].amount;
                this.combinedLimits = policy.risks[0].limitsOfLiability.filter(
                    (x) => x.liabilityType === 'combinedLimits'
                )[0].amount;

                //excesses
                this.below21Years = policy.risks[0].excesses.filter(
                    (x) => x.excessType === 'below21Years'
                )[0].amount;
                this.over70Years = policy.risks[0].excesses.filter(
                    (x) => x.excessType === 'over70Years'
                )[0].amount;
                this.noLicence = policy.risks[0].excesses.filter(
                    (x) => x.excessType === 'noLicence'
                )[0].amount;
                this.careLessDriving = policy.risks[0].excesses.filter(
                    (x) => x.excessType === 'careLessDriving'
                )[0].amount;

                this.otherEndorsement = policy.risks[0].excesses.filter(
                    (x) => x.excessType === 'otherEndorsement'
                )[0].amount;

                const doo = new Date(policy.endDate);
                const nd = new Date(
                    doo.getTime() - doo.getTimezoneOffset() * -60000
                );

                this.clientName = policy.client;
                // if(this.client.phone === undefined) { this.clientNumber = ''; } else {}
                // if(this.client.email === null || undefined) { this.clientEmail = ''; } else {}
                // if(this.clientAddress === null || undefined) { this.clientAddress = ''; } else {}

                this.agency = 'Direct'; // TODO: Track this guy too
                this.coverForm = nd.toString();
                this.coverTo = policy.endDate.toString();
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

        //         this.policiesService.getDebitNotes().subscribe((debitNotes) => {
        //             this.debitNotes = debitNotes;

        //             console.log('debit notes');
        //             console.log(this.debitNotes);
        //         });

        //         this.clientsService.getAllClients().subscribe((clients) => {
        //             this.clientsList = [...clients[0], ...clients[1]] as Array<
        //                 ICorporateClient & IIndividualClient
        //             >;

        //             console.log('clients: ');
        //             console.log(clients);

        //             this.client = this.clientsList.filter((x) =>
        //                 x.companyName
        //                     ? x.companyName === this.policyData.client
        //                     : x.firstName + ' ' + x.lastName === this.policyData.client
        //             )[0] as IIndividualClient & ICorporateClient;

        //             console.log('HERE =>>>>>');
        //             console.log(
        //                 this.clientsList.filter(
        //                     (x) => x.firstName + ' ' + x.lastName === 'Changa Lesa'
        //                 )[0] as IIndividualClient & ICorporateClient
        //             );

        //             // console.log('policy data client:');
        //             // console.log(this.policyData.client);

        //             // console.log('client');
        //             // console.log(this.client);
        //         });

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
            town: ['', Validators.required],
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
    }

    // getTimeStamp(policy: Policy): number {
    //     return (policy.startDate as ITimestamp).seconds;
    // }

    // getEndDateTimeStamp(policy: Policy): number {
    //     return (policy.endDate as ITimestamp).seconds;
    // }

    goToPoliciesList(): void {
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
                ...policyData,
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
                .subscribe((res) => {
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

                installment.push({
                    installmentAmount: iAmount,
                    installmentDate: this.formattedDate,
                    balance: iAmount,
                    installmentStatus: 'UnPaid',
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
                endDate: this.formattedeDate,
            };

            console.log('..........Payment Plan..........');
            console.log(plan);

            this._id = v4();
            const receipt: IReceiptModel = {
                id: this._id,
                paymentMethod: '',
                receivedFrom: policyData.client,
                onBehalfOf: policyData.client,
                // receivedFrom: this.paymentPlanForm.controls.clientName.value,
                // onBehalfOf: this.paymentPlanForm.controls.clientName.value,
                capturedBy: 'charles malama',
                policyNumber: '',
                receiptStatus: 'Receipted',
                narration: 'Payment Plan',
                receiptType: 'Premium Payment',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                todayDate: new Date(),
            };

            const planReceipt: PlanReceipt[] = [];
            planReceipt.push({
                id: this._id,
                onBehalfOf: policyData.client,
                allocationStatus: 'Unallocated',
                sumInDigits: this.paymentPlanForm.controls
                    .initialInstallmentAmount.value,
                policyNumber: '',
            });

            plan.planReceipt = planReceipt;
            console.log('=====================');

            console.log(receipt, plan);

            // add payment plan
            this.paymentPlanService.addPaymentPlanReceipt(receipt, plan);

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
                .subscribe((res) => {
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
        if (this.selectedRisk.insuranceType == 'Comprehensive') {
            this.cnd = risk.discounts.filter(
                (x) => x.discountType === 'No Claims Discount'
            )[0];
            console.log('RISK ID', risk.id);

            this.coverNot = this.coverNotes.filter(
                (x) => x.policyId === this.selectedRisk.id
            )[0];

            if (this.cnd === undefined) {
                this.cndAmount = 0;
            } else {
                this.cndAmount = Number(this.cnd.amount);
            }

            console.log('CND>>>>>', this.cndAmount);
            this.isComprehensiveCertificatePdfVisible = true;
            this.isThirdPartyCertificatePdfVisible = false;
        } else {
            this.coverNot = this.coverNotes.filter(
                (x) => x.policyId === risk.id
            )[0];
            this.isComprehensiveCertificatePdfVisible = false;
            this.isThirdPartyCertificatePdfVisible = true;
        }

        // this.isNewCertificatePdfVisible = true;
    }

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}
