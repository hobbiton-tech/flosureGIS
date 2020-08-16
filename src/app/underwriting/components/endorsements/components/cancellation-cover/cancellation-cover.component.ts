import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router } from '@angular/router';
import {
    CreditNote,
    DebitNote
} from 'src/app/underwriting/documents/models/documents.model';
import moment from 'moment';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { AccountService } from 'src/app/accounts/services/account.service';
import { IRequisitionModel } from 'src/app/accounts/components/models/requisition.model';
import { v4 } from 'uuid';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-cancellation-cover',
    templateUrl: './cancellation-cover.component.html',
    styleUrls: ['./cancellation-cover.component.scss']
})
export class CancellationCoverComponent implements OnInit {
    isRaisingRequisition: boolean = false;

    policiesList: Policy[];
    displayPoliciesList: Policy[];
    activePoliciesList: Policy[];
    displayActivePoliciesList: Policy[];
    cancelledPoliciesList: Policy[];
    displayCancelledPoliciesList: Policy[];

    columnAlignment = 'center';

    cancellationOfCoverIsLoading = false;

    searchString: string;
    cancelledPoliciesSearchString: string;
    activePoliciesSearchString: string;

    //Credit Note PDF
    isCreditNotePDFVisible = false;
    isCancelledPolicy = false;

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

    policyData: Policy = new Policy();
    policyNumber: string;
    risks: RiskModel[] = [];

    //creditNote
    creditNotes: CreditNote[];

    // policyCreditNote
    creditNote: CreditNote;

    // policy debit note
    debitNote: DebitNote;

    // requisition number
    reqNumber: string;

    constructor(
        private readonly router: Router,
        private readonly policiesService: PoliciesService,
        private accountsService: AccountService,
        private msg: NzMessageService
    ) {}

    ngOnInit(): void {
        this.cancellationOfCoverIsLoading = true;
        setTimeout(() => {
            this.cancellationOfCoverIsLoading = false;
        }, 3000);

        this.policiesService.getPolicies().subscribe(policies => {
            this.policiesList = policies;
            this.displayPoliciesList = this.policiesList;

            this.activePoliciesList = this.policiesList.filter(
                x => x.status === 'Active'
            );
            this.displayActivePoliciesList = this.activePoliciesList;
            console.log('active policies: ', this.displayActivePoliciesList);

            this.cancelledPoliciesList = this.policiesList.filter(
                x => x.status === 'Cancelled'
            );
            this.displayCancelledPoliciesList = this.cancelledPoliciesList;
            console.log(
                'cancelled policies: ',
                this.displayCancelledPoliciesList
            );
        });

        this.policiesService.getCreditNotes().subscribe(creditNotes => {
            this.creditNotes = creditNotes;
        });

        this.accountsService.getRequisitions().subscribe(requisitions => {
            this.reqNumber = this.accountsService.generateRequisitionID(
                requisitions.length
            );
        });
    }

    viewPolicyCreditNote(policy: Policy) {
        this.policiesService.getPolicyById(policy.id).subscribe(policy => {
            this.policyData = policy;
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

            this.isCreditNotePDFVisible = true;
        });
    }

    raiseRequisition(policy: Policy) {
        this.isRaisingRequisition = true;
        // policy credit note
        this.policiesService.getCreditNotes().subscribe(creditNotes => {
            this.creditNote = creditNotes.filter(
                creditNotePolicy => creditNotePolicy.policy.id == policy.id
            )[0];

            // temporary

            // this.accountsService.getRequisitions().subscribe(requisitions => {
            //     this.reqNumber = this.accountsService.generateRequisitionID(
            //         requisitions.length
            //     );
            // });

            console.log('credit note', this.creditNote);

            const policyUpdate: Policy = {
                ...policy,
                requisitionStatus: 'Raised'
            };

            const requisition: IRequisitionModel = {
                id: v4(),
                policyNumber: policy.policyNumber,
                requisitionNumber: this.reqNumber,
                payee: policy.client,
                cancellationDate: this.creditNote.dateCreated,
                dateCreated: new Date(),
                approvalStatus: 'Pending',
                paymentType: 'PYMT',
                currency: policy.currency,
                amount: this.creditNote.creditNoteAmount,
                paymentStatus: 'UnProcessed'
            };

            this.accountsService
                .createRequisition(requisition, this.creditNote.id)
                .subscribe(
                    res => {
                        console.log(res);
                        this.msg.success('Requisition Raised Successfully');
                        this.isRaisingRequisition = false;
                        this.router.navigateByUrl(
                            '/flosure/accounts/requisitions'
                        );
                    },

                    err => {
                        console.log(err);
                        this.msg.error('Failed to raise Requisition');
                        this.isRaisingRequisition = false;
                    }
                );

            this.policiesService.updatePolicy(policyUpdate);
        });
    }

    viewPolicyDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-cancellation-details/' + policy.id
        );
    }

    viewPolicyCancelledDetails(policy: Policy): void {
        this.router.navigateByUrl(
            '/flosure/underwriting/policy-cancellation-details/' + policy.id
        );
    }

    searchActivePolicies(value: string): void {
        if (value === '' || !value) {
            this.displayActivePoliciesList = this.activePoliciesList;
        }

        this.displayActivePoliciesList = this.activePoliciesList.filter(
            policy => {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.client.toLowerCase().includes(value.toLowerCase())
                );
            }
        );
    }

    searchCancelledPolicies(value: string): void {
        if (value === '' || !value) {
            this.displayCancelledPoliciesList = this.cancelledPoliciesList;
        }

        this.displayCancelledPoliciesList = this.cancelledPoliciesList.filter(
            policy => {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.client.toLowerCase().includes(value.toLowerCase())
                );
            }
        );
    }

    //calculate number of days between two dates and returns requisition amount
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
}
