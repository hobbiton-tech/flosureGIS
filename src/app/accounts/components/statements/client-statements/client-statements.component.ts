import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ICorporateClient, IIndividualClient } from '../../../../clients/models/clients.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../clients/services/clients.service';
import * as jspdf from 'jspdf';
import { Policy } from '../../../../underwriting/models/policy.model';
import { FormBuilder } from '@angular/forms';
import { PoliciesService } from '../../../../underwriting/services/policies.service';
import { PaymentPlanService } from '../../../services/payment-plan.service';
import { AccountService } from '../../../services/account.service';
import { CreditNote, DebitNote } from '../../../../underwriting/documents/models/documents.model';
import { concat } from 'rxjs';

@Component({
  selector: 'app-client-statements',
  templateUrl: './client-statements.component.html',
  styleUrls: ['./client-statements.component.scss']
})
export class ClientStatementsComponent implements OnInit {
  loadingStatement = false;
  generatingPDF = false;
  client: IIndividualClient & ICorporateClient;
  clientId: any;
  today = new Date();
  period: any[] = [];
  start: Date;
  end: Date;
  policyList: Policy[] = [];
  policies: Policy[] = [];
  resultList: any[] = [];
  statementType = '';
  planPolicies: any[] = [];
  receipts: any[] = [];
  receiptList: any[] = [];
  debitNotes: DebitNote[] = [];
  creditNotes: CreditNote[] = [];
  creditNoteList: CreditNote[] = [];

  balance = 0;

  constructor(
    private readonly route: Router,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private paymentPlanService: PaymentPlanService,
    private clientsService: ClientsService,
    private policyService: PoliciesService,
    private receiptService: AccountService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe(param => {
      this.clientId = param.id;
    });
    this.clientsService.getAllClients().subscribe(clients => {
      console.log(clients);
      this.client = [...clients[1], ...clients[0]].filter(
        x => x.id === this.clientId
      )[0] as IIndividualClient & ICorporateClient;
      console.log('CLIENTS', this.client);


      this.policyService.getPolicies().subscribe((res) => {
         this.policies = res.filter((x) => x.clientCode === this.clientId);
         this.policyList = this.policies;

        this.debitNotes = [...new Set([].concat(...this.policyList.map((o) => o.debitNotes)))];
        this.creditNotes = [...new Set([].concat(...this.policyList.map((o) => o.creditNotes)))];

        this.creditNoteList = this.creditNotes;



        this.receiptService.getReciepts().subscribe((receipts) => {
          console.log('Recepts>>>>>', receipts);

          if (this.planPolicies !== null || true) {
            if (  this.client.clientType === 'Individual') {
              this.receipts = receipts.data.filter((x) => x.on_behalf_of === this.client.firstName + ' ' + this.client.lastName);
            } else if (this.client.clientType === 'Corporate') {
              this.receipts = receipts.data.filter((x) => x.on_behalf_of === this.client.companyName);
            }
          }
          this.receiptList = this.receipts;
          this.resultList = [...this.policyList, ...this.creditNotes, ...this.receiptList];

          console.log('Results<><><><><?', this.resultList, this.policyList);
        });

      });
    });

    // this.paymentPlanService.getPaymentPlan().subscribe((payPlan) => {
    //   this.paymentPlanList = payPlan.data.filter((x) => x.client_id === this.clientId);
    //
    //   for (const p of this.paymentPlanList) {
    //     if (this.planPolicies !== null || this.planPolicies !== undefined) {
    //       this.planPolicies = this.planPolicies.find((el) => el.plan_id === p.id);
    //     }
    //   }
    // });


  }

  generatePDF() {
    const data = document.getElementById('printSection');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save( `${this.client.clientID}-Account-Statement.pdf`);
      this.generatingPDF = false;
    });
  }

  getPeriod(value) {
    this.start = value[0];
    this.end = value[1];
    this.policyList = this.policies.filter((x) => x.startDate >= this.start && x.startDate <= this.end);
    this.creditNoteList = this.creditNotes.filter((x) => x.dateCreated >= this.start && x.dateCreated <= this.end);
    this.receiptList = this.receipts.filter((x) => x.date_received >= this.start && x.date_received <= this.end);
    this.resultList = [...this.policyList, ...this.creditNotes, ...this.receiptList];


  }

  policyType(value) {
    if (value.receiptStatus === 'Unreceipted') {
      this.statementType = 'Debit';
    } else if (value.receiptStatus ) {

    }
    return this.statementType;
  }

  txnDate(value) {
    if (value.policyNumber) {
      return value.startDate;
    } else if (value.creditNoteNumber) {
      return value.dateCreated;
    } else  if (value.receipt_number) {
      return value.date_received;
    }
  }

  type(value) {
    if (value.policyNumber) {
      return 'Debit';
    } else if (value.creditNoteNumber) {
      return 'Cancelled';
    } else  if (value.receipt_number) {
      return 'Receipt';
    }
  }

  txnAmount(value) {
    if (value.policyNumber) {
      return value.netPremium;
    } else if (value.creditNoteAmount) {
      return value.dateCreated;
    } else  if (value.receipt_number) {
      return value.sum_in_digits;
    }
  }


  dr(value) {
    if (value.policyNumber) {
      return value.netPremium;
    }
  }


  ref(value) {
    if (value.policyNumber) {
      return value.policyNumber;
    } else if (value.creditNoteNumber) {
      return value.creditNoteNumber;
    } else  if (value.receipt_number) {
      return value.receipt_number;
    }
  }


  cr(value) {
    if (value.creditNoteNumber) {
      return value.creditNoteAmount * -1;
    } else  if (value.receipt_number) {
      return value.sum_in_digits * -1;
    }
  }

  remainingBalance(value) {
    let crValue = 0;
    let drValue = 0;
    if (this.cr(value) === undefined || this.cr(value) === null) {
      crValue = 0;
    } else {
      crValue = this.cr(value);
    }

    if (this.dr(value) === undefined || this.dr(value) === null) {
      drValue = 0;
    } else {
      drValue = this.dr(value);
    }
    this.balance = Number(this.balance) + Number(crValue) + Number(drValue);
    console.log('Balance>>>>', this.balance);
    return this.balance;
  }

}
