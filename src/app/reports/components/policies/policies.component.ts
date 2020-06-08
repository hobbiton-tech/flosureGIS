import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PremiumService } from '../../services/premium.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { Risks } from '../../model/quotation.model';
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
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styleUrls: ['./policies.component.scss'],
})
export class PoliciesComponent implements OnInit {
    clientList: MotorQuotationModel;
    // displayClientList: [];
    searchedClientList: [];

    quotesList: MotorQuotationModel[];
    filteredQuotesList: MotorQuotationModel[] = [];

    interList: any[];
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];

    filterPremiumReport: any[];

    // premiumProductionList: PremiumDTO[];
    displayPremiumProductionList: any[];

    dateForm: FormGroup;

    //search string when filtering clients
    searchString: string;

    //selected report
    selectedReportType: string;

    displayClientList: MotorQuotationModel;

    displayAnalysisReport: MotorQuotationModel;

    risks: any;
    quotation: any;

    displayDirectClientStatements: any;
    displayDebtorsAgeAnalysis: any;
    displayAgentBrokerStatement: any;
    displayCommissionEarnedStatement: any;
    displayIntermediaryStatementForClients: any;

    isVisible = false;
    isDebtorsAgeAnalysisReportVisible = false;
    isAgentBrokerStatementReportVisible = false;
    isCommissionEarnedStatementVisible = false;
    isIntermediaryStatementForClientsVisible = false;


   

    //
    //   data: AOA = [
    //     [1, 2],
    //     [3, 4],
    // ];

    intermediaries: Array<IAgent & IBroker & ISalesRepresentative>;
    formatIntermediaryReport: Array<IFormatIntermediaryReport>;

    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Report.xlsx';
    fileNameIntermediary = 'IntermediaryReport.xlsx';
    fileNameAnalysis = 'AnalysisReport.xlsx';

    fileLocation: string;

    constructor(
        private cdr: ChangeDetectorRef,
        private premiumService: PremiumService,
        private quotationService: QuotesService,
        private policiesService: PoliciesService,
        private agentsService: AgentsService,
        private formBuilder: FormBuilder
    ) {
        this.dateForm = this.formBuilder.group({
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
        });
    }
    handleOk(): void {
        this.isVisible = false;
        this.isDebtorsAgeAnalysisReportVisible = false;
        this.isAgentBrokerStatementReportVisible = false;
        this.isCommissionEarnedStatementVisible = false;
        this.isIntermediaryStatementForClientsVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
        this.isDebtorsAgeAnalysisReportVisible = false;
        this.isAgentBrokerStatementReportVisible = false;
        this.isCommissionEarnedStatementVisible = false;
        this.isIntermediaryStatementForClientsVisible = false;
    }

    showDirectClientModal() {
        this.isVisible = true;
    }
    showDebtorsAgeAnalysisModal() {
        this.isDebtorsAgeAnalysisReportVisible = true
    }
    showAgentBrokerStatementModal() {
        this.isAgentBrokerStatementReportVisible = true;
    }
    showCommissionEarnedStatementModal() {
        this.isCommissionEarnedStatementVisible = true;
    }
    IntermediaryStatementClientsReportModal() {
        this.isIntermediaryStatementForClientsVisible = true;
    }

    ngAfterViewInit(): void {
        this.selectedReportType = 'Quotation Report';
    }

    changeReportType(event): void {
        console.log(event);
    }

    ngOnInit(): void {
        let t = new Date(Date.parse(this.dateForm.get('toDate').value));
        let f = new Date(Date.parse(this.dateForm.get('fromDate').value));

        console.log(t, f);

        this.policiesService.getPolicies().subscribe((policies) => {
            this.displayDirectClientStatements = policies;
            console.log('Policy--->', this.displayDirectClientStatements);
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
                // console.log('=========>', this.displayInt ermediariesList);

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

        this.premiumService.generateAnalysisReport().subscribe((d) => {
            this.displayAnalysisReport = d;
            // console.log('Hey Am Report', this.displayAnalysisReport);
        });

        // this.premiumService
        //     .generateQuotationReport()
        //     .pipe(
        //         map((quotation) =>
        //             from(quotation).pipe(
        //                 filter(
        //                     (d: MotorQuotationModel) =>
        //                         d.startDate >=
        //                             f &&
        //                         Date.parse(d.startDate) <= t
        //                 )
        //             )
        //         ),
        //         tap((quotation) =>
        //             quotation.subscribe((d) => {
        //                 this.filterPremiumReport.push(d);
        //                 console.log(this.filterPremiumReport);
        //             })
        //         )
        //     )
        //     .subscribe();

        // this.getIntermediaryQuoteCount(this.intermediariesList);
        // this.getIntermediaryPolicyCount(this.intermediariesList);
        // this.getRatio(this.intermediariesList);
    }

    downloadPremiumProductionReport() {}

    handleDownloadTemplate() {
        const headings = [
            [
                'Number',
                'Client',
                'Transaction Date',
                'Underwriter',
                'Quotation Number',
                'Intermediary Name',
                'Branch',
                'Source of Business',
                'Product Type',
                'Sum Insured',
                'Gross Premium',
                'Status',
            ],
        ];
        // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headings);

        const element = document.getElementById('quotationReportTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    downloadQuotationList() {
        let element = document.getElementById('quotationReportTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    downloadIntermediaryList() {
        let element = document.getElementById('intermediaryTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileNameIntermediary);
    }

    downloadAnalysisList() {
        let element = document.getElementById('analysisTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileNameAnalysis);
    }

    downloadQuotationReportListPdf() {
        console.log('Downloading Pdf....');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';
        // let imgData = 'data:image/png;base64, '+ Base64.encode();
        // console.log(imgData);

        // doc.addImage(img, 'PNG', 10, 10, 280, 280);

        var header = function (headerData: any) {
            var text = 'A Plus General Insurance',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(text) *
                        doc.internal.getFontSize()) /
                        2;
            doc.setTextColor(173, 216, 230);
            doc.text(text, xOffset, 60);

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
                '#',
                'Client',
                'Transaction Date',
                'Underwriter',
                'Quotation #',
                'Intermediary Name',
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
        doc.setFontSize(19);

        //@ts-ignore
        // doc.autoTable({ html: 'Table' });
        doc.autoTable({
            html: 'Table',
            margin: { top: 80 },
            didDrawPage: header,
        });
        // autoTable(doc, { html: '#Table' });
        doc.save('intermediary' + new Date() + '.pdf');
    }

    downloadIntermediaryListPdf() {
        let doc = new jsPDF('p', 'pt');

        // doc.autoTable({html: '#intermediaryTable'})
        autoTable(doc, { html: '#Table' });
        doc.save('intermediary' + new Date() + '.pdf');
    }

    downloadAnalysisListPdf() {
        let doc = new jsPDF('p', 'pt');

        // doc.autoTable({html: '#analysisTable'})
        autoTable(doc, { html: '#analysisTable' });
        doc.save('intermediary' + new Date() + '.pdf');
    }

    _getFilterReportList(fromDate: Date, toDate: Date): void {
        if (fromDate === null || (!fromDate && toDate == null) || !toDate) {
            this.displayPremiumProductionList = this.filterPremiumReport;
        }

        this.premiumService
            .generateQuotationReport()
            .pipe(
                map((client) =>
                    from(client).pipe(
                        filter(
                            (d: MotorQuotationModel) =>
                                d.startDate >=
                                    this.dateForm.get('fromDate').value &&
                                d.startDate <= this.dateForm.get('toDate').value
                        )
                    )
                ),
                tap((client) =>
                    client.subscribe((d) => {
                        this.filterPremiumReport.push(d);
                        console.log(this.filterPremiumReport);
                    })
                )
            )
            .subscribe();
    }

    getFullName(i: any): any {
        return `${
            i.companyName
                ? i.companyName
                : i.contactFirstName + '' + i.contactLastName
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

        // return this.filteredPoliciesList.length;
    }

    getIntermediaryPolicyCount(intermediary: any): any {
        this.policiesService.getPolicies().subscribe((policies) => {
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

        this.policiesService.getPolicies().subscribe((policies) => {
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

    downloadDebtorsAgeAnalysisReportPdf() {
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
                'Account Number ',
                'Account type',
                'Account Name',
                '0-30 Days',
                '31-60 Days',
                '61-90 Days',
                '91-120 Days',
                '121-180 Days',
                '181-365Days',
                'Over 365 Days',
                'Open Cash',
                'Total Outstanding '
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

    downloadAgentBrokerStatementReportPdf() {
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
                'Intermediary Type',
                'Intermediary Name',
                'Transaction Date',
                'Transaction type',
                'Transaction number',
                'Policy/claim number',
                'Insured name',
                'Transaction amount',
                'DR (debit side)',
                'CR (Credit side)',
                'Balance (cumulative balance)'
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

    downloadCommissionEarnedStatementReportPdf() {
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
                'Intermediary Name',
                'Transaction Date',
                'Transaction status',
                'Receipt Number',
                'Debit note number',
                'Policy number',
                'Insured name',
                'Transaction amount',
                'Commission before tax',
                'Withholding tax amount',
                'Net commission due',
                'Cheque number'
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

    downloadIntermediaryStatementClientsReportPdf() {
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

    // search(value: string): void {
    //     if (value === '' || !value) {
    //         this.displayClientList = this.clientList;
    //     }

    //     this.displayClientList = this.clientList.filter(client => {
    //         if (client. === 'Individual') {
    //             return (
    //                 client.clientID
    //                     .toLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.clientType
    //                     .toLocaleLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.status
    //                     .toLocaleLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.firstName
    //                     .toLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.lastName.toLowerCase().includes(value.toLowerCase())
    //             );
    //         } else {
    //             return (
    //                 client.clientID
    //                     .toLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.clientType
    //                     .toLocaleLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.status
    //                     .toLocaleLowerCase()
    //                     .includes(value.toLowerCase()) ||
    //                 client.companyName
    //                     .toLowerCase()
    //                     .includes(value.toLowerCase())
    //             );
    //         }
    //     });
    // }
}
