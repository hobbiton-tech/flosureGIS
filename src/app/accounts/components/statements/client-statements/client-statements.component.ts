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
import * as moment from 'moment';

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
  start: string;
  end: string;
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

  resDetails: any;
  transactionList: any;

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

         // this.debitNotes = [...new Set([].concat(...this.policyList.map((o) => o.debitNotes)))];
         // this.creditNotes = [...new Set([].concat(...this.policyList.map((o) => o.creditNotes)))];
         //
         // this.creditNoteList = this.creditNotes;
      });


      this.clientsService.getTransactions().subscribe((txns: any) => {
        this.transactionList = txns.data.filter((x) => x.client_id === this.clientId);
      });
    });


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
    this.balance = 0;

    this.start = moment(this.start).format('YYYY-MM-DD');
    this.end = moment(this.end).format('YYYY-MM-DD');

    const tt = this.parseDate(this.end);
    const ff = this.parseDate(this.start);


    this.policyList = this.policies.filter((date) => {

      const newDate = moment(date.startDate).format('YYYY-MM-DD');

      const nn = this.parseDate(newDate);

      if (newDate >= this.start && newDate <= this.end) {
        return date;
      }
    });

    this.receiptList = this.receipts.filter((date) => {

      const newDate = moment(date.date_received).format('YYYY-MM-DD');
      const nn = this.parseDate(newDate);

      if (newDate >= this.start && newDate <= this.end) {
        return date;
      }
    });

    this.creditNoteList  = this.creditNotes.filter((date) => {

      const newDate = moment(date.dateCreated).format('YYYY-MM-DD');

      const nn = this.parseDate(newDate);

      if (newDate >= this.start && newDate <= this.end) {
        return date;
      }
    });

    this.resultList = [...this.policyList, ...this.creditNotes, ...this.receiptList].sort().reverse();
    this.remainingBalance(value);
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
    } else if (value.dateCreated) {
      return value.creditNoteAmount;
    } else  if (value.receipt_number) {
      return value.sum_in_digits;
    }
  }

  crDRBalance(value) {
    let cr = 0;
    let dr = 0;

    console.log('Values>>>>>', value);

    if (value.policyNumber) {
      dr = value.netPremium;
    }
    if (value.receipt_number) {
      cr = value.sum_in_digits * -1;
    }
    if (value.creditNoteNumber) {
      cr = value.creditNoteAmount * -1;
    }

    this.resDetails = {
      dr,
      cr
    };

    return this.resDetails;
  }


  dr(value) {
    if (value.policyNumber) {
      return value.netPremium;
    }
  }


  // ref(value) {
  //   if (value.type === Debit) {
  //     return value.policyNumber;
  //   } else if (value.creditNoteNumber) {
  //     return value.creditNoteNumber;
  //   } else  if (value.receipt_number) {
  //     return value.receipt_number;
  //   }
  // }


  cr(value) {
    if (value.creditNoteNumber) {
      return value.creditNoteAmount * -1;
    } else  if (value.receipt_number) {
      return value.sum_in_digits * -1;
    }
  }

  remainingBalance(value) {
    this.balance = Number(this.balance) + Number(this.crDRBalance(value).dr) + Number(this.crDRBalance(value).cr);
    return this.balance;
  }

  parseDate(input) {
    const parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
  }

}
