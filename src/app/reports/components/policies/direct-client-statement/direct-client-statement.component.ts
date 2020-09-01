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
import { PremiumService } from 'src/app/reports/services/premium.service';

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
  selector: 'app-direct-client-statement',
  templateUrl: './direct-client-statement.component.html',
  styleUrls: ['./direct-client-statement.component.scss']
})
export class DirectClientStatementComponent implements OnInit {
    
  interList: any[];
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];
    dateForm: FormGroup;

    quotesList: MotorQuotationModel[];
    
    filteredQuotesList: MotorQuotationModel[] = [];

      //selected report
      selectedReportType: string;
      displayDirectClientStatements: any;

      displayClientList: MotorQuotationModel;
 
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
     
  
 
 
 
 

  constructor(
    
  private formBuilder: FormBuilder,
  private message: NzMessageService,
  private router: Router,
  private agentService: AgentsService,
  private policesServices: PoliciesService,
  private premiumService: PremiumService,  
  private quotationService: QuotesService,

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



    this.agentService
    .getAllIntermediaries()
    .subscribe((intermediaries) => {
        this.intermediariesList = [
            ...intermediaries[0],
            ...intermediaries[1],
            ...intermediaries[2],
        ] as Array<IAgent & IBroker & ISalesRepresentative>;

        this.displayIntermediariesList = this.intermediariesList;
       
        this.formatIntermediaryReport = this.displayIntermediariesList.map(
            (i) => ({
                ...i,
                getFullName: this.getFullName(i),
                getPolicyCount: this.getIntermediaryPolicyCount(i),
                getQuoteCount: this.getIntermediaryQuoteCount(i),
                getRatio: this.getRatio(i),
            })
        );
        console.log('filter==>', this.formatIntermediaryReport);
    });

this.premiumService.generateQuotationReport().subscribe((d) => {
    this.displayClientList = d;
    this.displayClientList;
});


  }


  getFullName(i: any): any{
    return `${
      i.companyName?i.companyName:i.contactFirstName + '' + i.contactLastName
    }`;
  }


  getIntermediaryQuoteCount(intermediary: any): any {
    this.premiumService.generateQuoteReport().subscribe((quotes) => {
      this.quotesList = quotes;

      this.filteredQuotesList = this.quotesList.filter((x) =>
      x.intermediaryName == intermediary.companyName
          ? intermediary.companyName
          : intermediary.contactFirstName +
            ' ' +
            intermediary.contactLastName
  );

  return `${this.filteredQuotesList.length}`;

  console.log('QuotesList', this.quotesList);
  console.log('filterQuotes=> ', this.filteredQuotesList.length);
});
  }

  getIntermediaryPolicyCount(intermediary: any): any {
    this.policesServices.getPolicies().subscribe((policies) => {
        this.policiesList = policies;
        this.filteredPoliciesList = this.policiesList.filter((x) =>
            x.intermediaryName == intermediary.companyName
                ? intermediary.companyName
                : intermediary.contactFirstName +
                  ' ' +
                  intermediary.contactLastName
        );
        return `${this.filteredPoliciesList.length}`;
        // console.log('=>>>>' + this.filteredPoliciesList.length);
    });

    // return this.filteredPoliciesList.length;
}


  
 
  getRatio(intermediary: any): number {
    let quoteNumber;
    let policyNumber;

    this.policesServices.getPolicies().subscribe((policies) => {
        this.policiesList = policies;
        this.filteredPoliciesList = this.policiesList.filter((x) =>
            x.intermediaryName == intermediary.companyName
                ? intermediary.companyName
                : intermediary.contactFirstName +
                  ' ' +
                  intermediary.contactLastName
        );

        quoteNumber = this.filteredQuotesList.length;
    });

    this.quotationService.getMotorQuotations().subscribe((policies) => {
        this.quotesList = policies;
        this.filteredQuotesList = this.quotesList.filter((x) =>
            x.intermediaryName == intermediary.companyName
                ? intermediary.companyName
                : intermediary.contactFirstName +
                  ' ' +
                  intermediary.contactLastName
        );

        policyNumber = this.filteredQuotesList;
    });
    // console.log('Get=>>>>' + this.filteredQuotesList.length);
    // console.log('Count=>>>>' + this.filteredPoliciesList.length);

    return (policyNumber / quoteNumber) * 100;
}















  downloadDirectClientStatementsPdf() {
    // const moment = require('moment');
    // const today = moment();

    console.log('Downloading Pdf....');
    let doc = new jsPDF('l', 'pt', 'a4');
    var img = new Image();
    img.src = 'assets/images/apluslogo.png';
    // let imgData = 'data:image/png;base64, '+ Base64.encode();
    // console.log(imgData);

    // doc.addImage(img, 'PNG', 10, 10, 280, 280);

    var header = function (headerData: any) {
        // var subtext = 'A Plus General Insurance',

        // xOffset =
        //     doc.internal.pageSize.width / 2 -
        //     (doc.getStringUnitWidth(text) *
        //         doc.internal.getFontSize()) /
        //         2;

        var text = 'Quotation Listing Report',
            xOffset =
                doc.internal.pageSize.width / 2 -
                (doc.getStringUnitWidth(text) *
                    doc.internal.getFontSize()) /
                    2;

        doc.setTextColor(173, 216, 230);
        doc.text(text, xOffset, 60);
        // doc.text(subtext, xOffset, 70)

        doc.setFontSize(25);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.addImage(
            img,
            'PNG',
            headerData.settings.margin.left,
            20,
            60,
            60
        );

        // doc.text('Aplus Insurance', 60, 40, 250, 'center');
        // const currentdate = new Date();
        // const datetime =
        //     currentdate.getDate() +
        //     '/' +
        //     (currentdate.getMonth() + 1) +
        //     '/' +
        //     currentdate.getFullYear();
        // doc.text(
        //     'Date: ' + datetime,
        //     headerData.settings.margin.left + 400,
        //     60
        // );
        // doc.setFontSize(5);
    };

    const head = [
        [
            'No',
            'Transaction Date',
            'Transaction type',
            'Transaction number (debit/credit/receipt no/claim offset number)',
            'Policy/claim number',
            'Insured name',
            'Transaction amount',
            'DR (debit side)',
            'CR (Credit side)',
            'Balance (cumulative balance)',
        ],
    ];

    const totalPagesExp = '{total_pages_count_string}';

    const options = {
        beforePageContent: header,
        //   afterPageContent: footer,
        margin: {
            top: 100,
        },
        head: head,
        styles: {
            overflow: 'linebreak',
            fontSize: 10,
            tableWidth: 'auto',
            columnWidth: 'auto',
        },
        columnStyles: {
            1: { columnWidth: 'auto' },
        },
    };

    // const elem = document.getElementById('table');
    // const data = doc.autoTableHtmlToJson(elem);
    // doc.autoTable( data.columns, data.rows, options);

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    //    doc.autoTable(columns, rows);
    doc.setFontSize(15);

    //@ts-ignore
    doc.autoTable({
        html: 'Table',
        margin: { top: 80 },
        didDrawPage: header,
    });
    // autoTable(doc, { html: '#Table' });
    doc.save('quotationReport.pdf');
}

}
