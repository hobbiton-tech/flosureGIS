import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PremiumService } from '../../services/premium.service';
import { map, filter, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { PremiumDTO } from 'src/app/quotes/services/quotes.service';
import {
    IPremiumReport,
    IPolicyReportDto,
    ICommissionReportDto,
    IIntermediaryReportDto,
    ICreditNoteReportDto,
    IDebitNoteReportDto,
} from '../../model/premium';
import { IIndividualClientDto } from 'src/app/clients/models/client.dto';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import {
    IAgent,
    IBroker,
    ISalesRepresentative,
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';

import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { PolicyDto } from '../../model/quotation.model';

interface FilterMotorQuotation extends MotorQuotationModel {
    client: string;
    quoteNumber: string;
    dateCreated: Date;
    branch: string;
    status: QuoteStatus;
    basicPremiumSubTotal: number;
    sumInsured?: number;
    sourceOfBusiness: string;
    intermediaryName: string;
    productType: string;
}

export type QuoteStatus = 'Draft' | 'Approved';

interface IFormattedAnalysisReport
    extends IAgent,
        IBroker,
        ISalesRepresentative {
    getQuoteCount: number;
    getPolicyCount: number;
    getRatio: number;
}

@Component({
    selector: 'app-underwriting',
    templateUrl: './underwriting.component.html',
    styleUrls: ['./underwriting.component.scss'],
})
export class UnderwritingComponent implements OnInit {
    isVisible = false;
    visible = false;

    isAnalysisReportVisible = false;
    isReportVisible = false;

    //Qoutation Listing Report
    displayQuotationReport: MotorQuotationModel[];

    displayPolicyReport: Policy[] = []; 

    // Quotation Analysis Report
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    formatIntermediaryReport: Array<IFormattedAnalysisReport>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];

    quotesList: MotorQuotationModel[];
    filteredQuotesList: MotorQuotationModel[] = [];

    // renewal report
    isRenewalReportVisible = false;

    isPremiumWorkingReportVisible = false;
    isDebitNoteReportVisible = false;
    isProductionReportVisible = false;

    dateForm: FormGroup;

    timeDay = new Date();
    fileName = 'PremiumReportTable' + this.timeDay + '.xlsx';

    @ViewChild('content') content: ElementRef;

    public savaPDF(): void{
      let content = this.content.nativeElement;
      let doc = new jsPDF('l', 'pt', 'a4');
      let _elementHandlers ={
          '#editor': function(element, renderer){
              return true;
          }
      };

     var res =  doc.fromHTML(content.innerHTML, 15, 15, {
          'width': 700,
          'elementHandlers': _elementHandlers
      });

      doc.save('test.pdf')
    }

    constructor(
        private premiumService: PremiumService,
        private agentsService: AgentsService,
        private quotationService: QuotesService,
        private policiesService: PoliciesService
    ) {}

    showModal(): void {
        this.isVisible = true;
    }

    showIntermediaryModal(): void {}

    showAnalysisReportModal(): void {
        this.isAnalysisReportVisible = true;
    }

    showRenewalReportModal(): void {
        this.isRenewalReportVisible = true;
    }

    showDebitNoteReportModal(): void {
        this.isDebitNoteReportVisible = true;
    }

    showProductionReportModal(): void {
        this.isProductionReportVisible = true;
    }

    showPremiumWorkingReportModal(): void {
        this.isPremiumWorkingReportVisible = true;
    }

    ngOnInit(): void {
        this.quotationService.getMotorQuotations().subscribe((d) => {
            this.displayQuotationReport = d;
            console.log('Motor--->', this.displayQuotationReport);
        });

        this.policiesService.getPolicies().subscribe((policies) => {
            this.displayPolicyReport = policies;
            console.log('Policy--->', this.displayPolicyReport);
        });

        this.agentsService
            .getAllIntermediaries()
            .subscribe((intermediaries) => {
                this.intermediariesList = [
                    ...intermediaries[0],
                    ...intermediaries[1],
                    ...intermediaries[2],
                ] as Array<IAgent & IBroker & ISalesRepresentative>;

                this.displayIntermediariesList = this.intermediariesList;
                console.log('Inter ======>', this.displayIntermediariesList);

                this.formatIntermediaryReport = this.displayIntermediariesList.map(
                    (i) => ({
                        ...i,
                        getFullName: this.getFullName(i),
                        getPolicyCount: this.getIntermediaryPolicyCount(i),
                        getQuoteCount: this.getIntermediaryQuoteCount(i),
                        getRatio: this.getRatio(i),
                    })
                );
                console.log('filter ==>', this.formatIntermediaryReport);
            });
    }

    handleOk(): void {
        this.isVisible = false;
        this.isAnalysisReportVisible = false;
        this.isRenewalReportVisible = false;
        this.isPremiumWorkingReportVisible = false;
        this.isDebitNoteReportVisible = false;
        this.isProductionReportVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
        this.isAnalysisReportVisible = false;
        this.isRenewalReportVisible = false;
        this.isPremiumWorkingReportVisible = false;
        this.isDebitNoteReportVisible = false;
        this.isProductionReportVisible = false;
    }

    //Quotation Listing Report functions
    getFullName(i: any): any {
        return `${
            i.companyName
                ? i.companyName
                : i.contactFirstName + '' + i.contactLastName
        }`;
    }

    getIntermediaryQuoteCount(intermediary: any): any {
        this.quotationService.getMotorQuotations().subscribe((quotes) => {
            this.quotesList = quotes;

            this.filteredQuotesList = this.quotesList.filter((x) =>
                x.intermediaryName == intermediary.companyName
                    ? intermediary.companyName
                    : intermediary.contactFirstName +
                      ' ' +
                      intermediary.contactLastName
            );

            // return `${this.filteredQuotesList.length}`;

            //console.log('QuotesList', this.quotesList);
            // console.log('FILTERED QUOTES===>', this.filteredQuotesList.length);

            return this.filteredQuotesList.length;
        });
        return this.filteredQuotesList.length;
    }

    getIntermediaryPolicyCount(intermediary: any): any {
        this.policiesService.getPolicies().subscribe((policies) => {
            console.log(policies);

            this.policiesList = policies;
            this.filteredPoliciesList = this.policiesList.filter((x) =>
                x.intermediaryName == intermediary.companyName
                    ? intermediary.companyName
                    : intermediary.contactFirstName +
                      ' ' +
                      intermediary.contactLastName
            );
            // return `${this.filteredPoliciesList.length}`;
            // console.log('=>>>>' + this.filteredPoliciesList.length);
            return this.filteredPoliciesList.length;
        });

        return this.filteredPoliciesList.length;
    }

    getRatio(intermediary: any): any {
        let quoteNumber;
        let policyNumber;

        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            this.filteredPoliciesList = this.policiesList.filter(
                (x) => x.intermediaryName == 'hobbiton'

                // intermediary.companyName
                //     ? intermediary.companyName
                //     : intermediary.contactFirstName +
                //       ' ' +
                //       intermediary.contactLastName
            );

            quoteNumber = this.filteredPoliciesList[0];
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

        return (34 / 70) * 100;
    }

    downloadQuotationReportListPdf() {
        // const moment = require('moment');
        // const today = moment();

        // var todayDate = Date.toString("dd-MM-yy");

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
                150,
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
                'Quotation Number',
                'Client',
                'Transaction Date',
                'Underwriter',
                'Intermediary',
                'Branch',
                'Source of Business',
                'Product Type',
                'Sum Insured',
                'Gross Premium',
                'Status',
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
                lineWidth: 0.01,
                lineColor: 0,
                fillStyle: 'DF',
                halign: 'center',
                valign: 'middle',
                overflow: 'linebreak',
                fontSize: 8,
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

        // if( int i > 0){
        //     doc.addPage(612, 791)
        // }

        // doc.setPage(i+1);
        //    doc.autoTable(columns, rows);
        // doc.setFontSize(15);

        //@ts-ignore
        // doc.autoTable(
        //     {
        //         html: 'Table',
        //         margin: { top: 80 },
        //         didDrawPage: header,
        //     },
        //     options
        // );

        let content = this.content.nativeElement;

        //@ts-ignore
        doc.autoTable({
            html: content,
            fontSize: 9,
            margin: { top: 80 },
            didDrawPage: header,
        });
        // autoTable(doc, { html: '#Table' });
        doc.save('quotationReport.pdf');
    }

    downloadAnalysisListPdf() {
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
                'Branch',
                'Client',
                'Intermediary Name',
                'Number of Quotation',
                'Acquisition Ratio',
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
        doc.save('quotationAnalysisReport.pdf');
    }

    downloadRenewalListPdf() {
        console.log('Downloading Pdf....');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
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
        };

        const head = [
            [
                'No',
                'Branch',
                'Client',
                'Intermediary Name',
                'Number of Quotation',
                'Acquisition Ratio',
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
        doc.save('quotationRenewalReport.pdf');
    }

    downloadDebitNoteReportPdf() {
        console.log('Downloading Pdf....');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
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
        };

        const head = [
            [
                'Client Name',
                'Transaction Date',
                'Underwriter',
                'Policy Number',
                'Intermediary Name',
                'Branch',
                'Class of Business',
                'Product',
                'Risk ID',
                'Sum Insured',
                'Gross Premium',
                'Insurance Levy',
                'Commission amount',
                'Currency',
                'Endorsement type',
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
        doc.save('DebitNoteReport.pdf');
    }

    downloadProductionListPdf() {
        console.log('Downloading Pdf....');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
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
        };

        const head = [
            [
                'Client Name',
                'Transaction Date',
                'Underwriter',
                'Policy Number',
                'Intermediary Name',
                'Branch',
                'Class of Business',
                'Product',
                'Risk ID',
                'Sum Insured',
                'Gross Premium',
                'Insurance Levy',
                'Commission amount',
                'Currency',
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
        doc.save('quotationRenewalReport.pdf');
    }

    downloadPremiumWorkingPdf() {
        console.log('Downloading Pdf....');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
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
        };

        const head = [
            [
                'Policy Number',
                'Debit note number',
                'Gross Premium',
                'Discount',
                'Loading',
                'Net Premium',
                'Insurance Levy',
                'Premium Due',
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
        doc.save('PremiumWorkingReport.pdf');
    }

    //   _getFilterReportList(fromDate: Date, toDate: Date): void {
    //     if (fromDate === null || (!fromDate && toDate == null) || !toDate) {
    //         this.displayPremiumProductionList = this.filterPremiumReport;
    //     }

    //     this.premiumReportService.generatePremiumProductionReport()
    //         .pipe(
    //             map((premium) =>
    //                 from(premium).pipe(
    //                     // filter(
    //                     //     (d: Client) =>
    //                     //         d.dateCreated >= this.dateForm.get('fromDate').value &&
    //                     //         d.dateCreated <= this.dateForm.get('toDate').value
    //                     // )
    //                 )
    //             ),
    //             tap((premium) =>
    //             premium.subscribe((d) => {
    //                     this.filterPremiumReport.push(d);
    //                     console.log(this.filterPremiumReport)
    //                 })
    //             )
    //         )
    //         .subscribe();
    // }

    downloadQuotationReportListExcel() {
        let element = document.getElementById('Table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}
