import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import * as XLSX from 'xlsx';
import {
    IAgent,
    IBroker,
    ISalesRepresentative,
} from 'src/app/settings/components/agents/models/agents.model';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { map, filter, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { date } from 'faker';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

// import jsPDF = require('jspdf')
// import autoTable, { autoTable as autoTableType} from 'jspdf-autotable'

interface IFormatIntermediaryReport
    extends IAgent,
        IBroker,
        ISalesRepresentative {
    // getFullName: string;
    getQuoteCount: number;
    getPolicyCount: number;
    getRatio: number;
}


@Component({
  selector: 'app-agnent-broker-statement-report',
  templateUrl: './agnent-broker-statement-report.component.html',
  styleUrls: ['./agnent-broker-statement-report.component.scss']
})
export class AgnentBrokerStatementReportComponent implements OnInit {
    
  interList: any[];
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];
    dateForm: FormGroup;

      //selected report
      selectedReportType: string;
      displayDirectClientStatements: any;

 
      reportForm: FormGroup;

      isVisible = false
 
      size = 'large';
      isVisibleReportType = false;
  
      typeOfReport = ['DirectClient','DebtorsAgeAnalysis','AgentBrokerStatement', 'CommissionEarnedStatement', 'IntermediaryStatementForClients'];

      selectedType = 'DirectClient';
      reportNewCount: number;

      selectedAgent: any;
 
      intermediaries: Array<IAgent & IBroker & ISalesRepresentative>;
      formatIntermediaryReport: Array<IFormatIntermediaryReport>;
  
      wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  
      /*name of the risks template that will be downloaded. */
      fileName = 'Report.xlsx';
      fileNameIntermediary = 'IntermediaryReport.xlsx';
      fileNameAnalysis = 'AnalysisReport.xlsx';
  
      fileLocation: string;
      today: any;
 
      getQuoteCount: number;
      getPolicyCount: number;
      getRatio: number;
  
 
 
 
 
 
 
 
 
 constructor(
  private formBuilder: FormBuilder,
  private message: NzMessageService,
  private router: Router,
  private agentService: AgentsService,
  private policesServices: PoliciesService


 ) { 
  this.dateForm = this.formBuilder.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
});
this.reportForm = this.formBuilder.group({
    transactionType: ['', Validators.required],
    transactionNumber: ['', Validators.required],
    policyNumber: ['', Validators.required],
    insuredName: ['', Validators.required],
    transactionAmount: ['', Validators.required],
    debitSide: ['', Validators.required],
    creditSide: ['', Validators.required],
    balance: ['', Validators.required],
    dateReceived: ['', Validators.required],
      todayDate: [this.today],
    intermediaryType: ['', Validators.required],
    intermediaryName: ['', Validators.required],
    transactionDate: ['', Validators.required],
    transactionStatus: ['', Validators.required],
})
 }

 handleOk(): void {
  this.isVisible = false;
 
 }
 handleCancel(): void {
  console.log('Button cancel clicked!');
  this.isVisible = false;
}

showDirectClientModal() {
  this.isVisible = true;
}
ngAfterViewInit(): void {
  this.selectedReportType = 'Quotation Report';
}

changeReportType(event): void {
  console.log(event);
}


  ngOnInit(): void {
    let t = this.dateForm.get('toDate').value;
    let f = this.dateForm.get('fromDate').value;

    console.log('this->', t, f);

    this.policesServices.getPolicies().subscribe((policies) => {
        this.displayDirectClientStatements = policies;
        console.log('Policy--->', this.displayDirectClientStatements);
    });














  }

}
