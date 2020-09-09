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
  resultList: any[] = [];
  statementType = '';
  paymentPlanList: any[] = [];
  planReceipts: any[] = [];
  planPolicies: any[] = [];
  receipts: any[] = [];

  constructor(
    private readonly route: Router,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private paymentPlanService: PaymentPlanService,
    private clientsService: ClientsService,
    private policyService: PoliciesService,
    private receiptService: AccountService,
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
    });
    this.policyService.getPolicies().subscribe((res) => {
      this.policyList = res.filter((x) => x.clientCode === this.clientId);
      for (const p of this.policyList) {
        this.resultList = this.resultList.concat(p.debitNotes, p.creditNotes);
      }

    });

    this.paymentPlanService.getPaymentPlan().subscribe((payPlan) => {
      this.paymentPlanList = payPlan.data.filter((x) => x.client_id === this.clientId);

      for (const p of this.paymentPlanList) {
        if (this.planPolicies !== null || true) {
          this.planPolicies = this.planPolicies.find((el) => el.plan_id === p.id);
        }
      }
    });

    this.receiptService.getReciepts().subscribe((receipts) => {
      if (this.planPolicies !== null || true) {
        this.receipts = receipts.data.filter((x) => x.client_id === this.clientId);
      }

    });

    this.resultList = this.resultList.concat(this.resultList, this.receipts);
    console.log('Results<><><><><?', this.resultList);
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
  }

  policyType(value) {
    if (value.receiptStatus === 'Unreceipted') {
      this.statementType = 'Debit';
    } else if (value.receiptStatus ) {

    }
    return this.statementType;
  }

}
