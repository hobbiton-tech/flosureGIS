import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from '@angular/forms';
import { PremiumService } from '../../services/premium.service';
import { map, filter, tap } from 'rxjs/operators';
import { from, Observable, Subject, of } from 'rxjs';
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

import * as moment from 'moment';

import * as XLSX from 'xlsx';
import { PolicyDto } from '../../model/quotation.model';
// import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import { DebitNote } from '../../../underwriting/documents/models/documents.model';
import _, { result } from 'lodash';
import { CommisionSetupsService } from 'src/app/settings/components/agents/services/commision-setups.service';
import { ICommissionSetup } from 'src/app/settings/components/agents/models/commission-setup.model';
import { quotes } from 'html2canvas/dist/types/css/property-descriptors/quotes';
import { Xmb } from '@angular/compiler';

import { BehaviorSubject } from 'rxjs';

import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';

let workbook: ExcelProper.Workbook = new Excel.Workbook();

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

interface Motor extends MotorQuotationModel {
    sumInsured: number;
    grossPremium: number;
}

interface PremiumReport extends Policy {
    policyNumber: string;
    debitNoteNumber: string;
    grossPremium: string;
    loading: number;
    discount: number;
    netPremium: number;
    levy: number;
    premiumDue: number;
    commission?: number;
}

export type QuoteStatus = 'Draft' | 'Approved';

interface IFormattedAnalysisReport
    extends IAgent,
        IBroker,
        ISalesRepresentative {
    getFullName: string;
    getQuoteCount: any;
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
    // visible = false;

    //search string when filtering clients
    searchString: string;

    //Qoutation Listing Report
    motorList: MotorQuotationModel[];
    motor: Motor[];
    filterMotor: Motor[];
    displayedMotor: Motor[];
    displayedFilterMotor: Motor[];

    displayPolicyReport: Policy[] = [];
    policyList: Policy[] = [];

    // // Quotation Analysis Report
    // intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    // formatIntermediaryReport: Array<IFormattedAnalysisReport>;
    // displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];
    filterPremiumList: Array<PremiumReport>;

    quotesList: MotorQuotationModel[];

    // renewal report
    isRenewalReportVisible = false;
    isPremiumWorkingReportVisible = false;
    isDebitNoteReportVisible = false;
    isProductionReportVisible = false;
    isIntermediaryQuotationListingReport = false;
    isAnalysisReportVisible = false;
    isReportVisible = false;

    dateForm: FormGroup;

    timeDay = new Date();
    fileName = 'PremiumReportTable' + this.timeDay + '.xlsx';

    filterPremiumReport: any;
    displayPremiumReport: Policy[];
    premiumReport: Policy[];

    filterForm = new FormGroup({
        fromDate: new FormControl(),
        toDate: new FormControl(),
    });

    get fromDate() {
        return this.filterForm.get('fromDate');
    }
    get toDate() {
        return this.filterForm.get('toDate');
    }

    constructor(
        private premiumService: PremiumService,
        private agentsService: AgentsService,
        private commissionService: CommisionSetupsService,
        private quotationService: QuotesService,
        private policiesService: PoliciesService,
        private formBuilder: FormBuilder
    ) {
        this.dateForm = this.formBuilder.group({
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
        });
    }

    showModal(): void {
        this.isVisible = true;
    }

    showIntermediaryModal(): void {
        this.isIntermediaryQuotationListingReport = true;
    }

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

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }

    ngOnInit(): void {
        let sourceOfBusiness = 'direct';

        this.quotationService.getMotorQuotations().subscribe((d) => {
            this.motorList = d;
            this.motor = this.motorList.map((m) => ({
                ...m,
                sumInsured: this.sumArray(m.risks, 'sumInsured'),
                grossPremium: this.sumArray(m.risks, 'basicPremium'),
            }));

            this.displayedMotor = this.motor;
            console.log('Motor--->', this.displayedMotor);

            this.filterMotor = this.motor.filter(
                (x) => x.sourceOfBusiness !== sourceOfBusiness
            );
            this.displayedFilterMotor = this.filterMotor;
        });

        this.policiesService.getPolicies().subscribe((policy) => {
            this.premiumReport = policy;

            this.filterPremiumList = this.premiumReport.map((x) => ({
                ...x,
                policyNumber: x.policyNumber,
                debitNoteNumber: x.debitNotes[0].debitNoteNumber,
                grossPremium: this.sumArray(x.risks, 'basicPremium'),
                loading: this.sumArray(x.risks, 'loadingTotal'),
                discount: this.sumArray(x.risks, 'discountTotal'),
                netPremium: this.sumArray(x.risks, 'netPremium'),
                levy: this.sumArray(x.risks, 'premiumLevy'),
                premiumDue: x.sumInsured,
            }));

            this.displayPremiumReport = this.filterPremiumList;
            console.log('New Policy--->', this.filterPremiumList);
        });

        // this.agentsService
        //     .getAllIntermediaries()
        //     .subscribe((intermediaries) => {
        //         this.intermediariesList = [
        //             ...intermediaries[0],
        //             ...intermediaries[1],
        //             ...intermediaries[2],
        //         ] as Array<IAgent & IBroker & ISalesRepresentative>;

        //         this.displayIntermediariesList = this.intermediariesList;
        //         // console.log('Inter ======>', this.displayIntermediariesList);

        //         this.formatIntermediaryReport = this.displayIntermediariesList.map(
        //             (i) => ({
        //                 ...i,
        //                 getFullName: this.getFullName(i),
        //                 getPolicyCount: this.getIntermediaryPolicyCount(i),

        //                 //passing it here
        //                 getQuoteCount: this.getIntermediaryQuoteCount(i).then(
        //                     (result) => {
        //                         console.log('am not good at angular', result);
        //                     }
        //                 ),
        //                 getRatio: this.getRatio(i),
        //             })
        //         );
        //         console.log('Intermediary Name', this.formatIntermediaryReport);
        //     });
        // console.log('Intermediary Name', this.intermediary);
    }

    /// the function to get all quotation by per intermediary//
    // async getIntermediaryQuoteCount(intermediary: any) {
    //     let quote: any;

    //     await this.quotationService
    //         .getMotorQuotations()
    //         .toPromise()
    //         .then((quotes: MotorQuotationModel[]) => {
    //             this.quotesList = quotes;

    //             this.filteredQuotesList = this.quotesList.filter((item) =>
    //                 item.intermediaryName === intermediary.companyName
    //                     ? intermediary.companyName
    //                     : intermediary.contactFirstName +
    //                       ' ' +
    //                       intermediary.contactLastName
    //             );
    //             // .map((x) => x.id);

    //             quote = this.filteredQuotesList.length;
    //             console.log('test one', quote);
    //         });

    //     console.log('test two', this.quotesList);
    //     return quote;
    // }

    // getFullName(i: any): any {
    //     return `${
    //         i.companyName
    //             ? i.companyName
    //             : i.contactFirstName + '' + i.contactLastName
    //     }`;
    // }

    // async getCommission(name: string) {
    //     await this.commissionService.getCommissionSetups().subscribe((x) =>
    //         x
    //             .filter((x) => x.intermediaryName === name)
    //             .map((m) => {
    //                 this.commission = m.commission;
    //                 // console.log('this comm',commission)
    //             })
    //     );

    //     console.log('This Knew->', this.commission);
    //     this.commission;
    // }

    handleOk(): void {
        this.isVisible = false;
        this.isAnalysisReportVisible = false;
        this.isRenewalReportVisible = false;
        this.isPremiumWorkingReportVisible = false;
        this.isDebitNoteReportVisible = false;
        this.isProductionReportVisible = false;
        this.isIntermediaryQuotationListingReport = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
        this.isAnalysisReportVisible = false;
        this.isRenewalReportVisible = false;
        this.isPremiumWorkingReportVisible = false;
        this.isDebitNoteReportVisible = false;
        this.isProductionReportVisible = false;
        this.isIntermediaryQuotationListingReport = false;
    }

    //Quotation Listing Report functions

    // getIntermediaryQuoteCount(intermediary: any): number {
    //     this.quotationService.getMotorQuotations().subscribe((quotes) => {
    //         this.quotesList = quotes;

    //         this.filteredQuotesList = this.quotesList.filter((x) =>
    //             x.intermediaryName == intermediary.companyName
    //                 ? intermediary.companyName
    //                 : intermediary.contactFirstName +
    //                   ' ' +
    //                   intermediary.contactLastName
    //         );
    //     });
    //     console.log('-------->-->->', this.filteredQuotesList.length);
    //     return this.filteredQuotesList.length;
    // }

    // getIntermediaryPolicyCount(intermediary: any) {
    //     this.policiesService.getPolicies().subscribe((policies) => {
    //         console.log(policies);

    //         this.policiesList = policies;
    //         this.try = this.policiesList.filter(
    //             (x) => x.intermediaryName === 'hobbiton'
    //             // intermediary.companyName
    //             //     ? intermediary.companyName
    //             //     : intermediary.contactFirstName +
    //             //       ' ' +
    //             //       intermediary.contactLastName
    //         );
    //     });

    //     console.log('am test you=>>>>' + this.try);

    //     return this.try;
    // }

    // getRatio(intermediary: any): any {
    //     let quoteNumber;
    //     let policyNumber;

    //     this.policiesService.getPolicies().subscribe((policies) => {
    //         this.policiesList = policies;
    //         this.filteredPoliciesList = this.policiesList.filter(
    //             (x) => x.intermediaryName == 'hobbiton'

    //             // intermediary.companyName
    //             //     ? intermediary.companyName
    //             //     : intermediary.contactFirstName +
    //             //       ' ' +
    //             //       intermediary.contactLastName
    //         );

    //         quoteNumber = this.filteredPoliciesList[0];
    //     });

    //     this.quotationService.getMotorQuotations().subscribe((policies) => {
    //         this.quotesList = policies;
    //         this.filteredQuotesList = this.quotesList.filter((x) =>
    //             x.intermediaryName == intermediary.companyName
    //                 ? intermediary.companyName
    //                 : intermediary.contactFirstName +
    //                   ' ' +
    //                   intermediary.contactLastName
    //         );

    //         policyNumber = this.filteredQuotesList;
    //     });
    //     // console.log('Get=>>>>' + this.filteredQuotesList.length);
    //     // console.log('Count=>>>>' + this.filteredPoliciesList.length);

    //     return (34 / 70) * 100;
    // }

    downloadQuotationReportListPdf() {
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

        // const head = [
        //     [
        //         'No',
        //         'Branch',
        //         'Client',
        //         'Intermediary Name',
        //         'Number of Quotation',
        //         'Acquisition Ratio',
        //     ],
        // ];

        const totalPagesExp = '{total_pages_count_string}';

        // const options = {
        //     beforePageContent: header,
        //     //   afterPageContent: footer,
        //     margin: {
        //         top: 100,
        //     },
        //     head: head,
        //     styles: {
        //         overflow: 'linebreak',
        //         fontSize: 10,
        //         tableWidth: 'auto',
        //         columnWidth: 'auto',
        //     },
        //     columnStyles: {
        //         1: { columnWidth: 'auto' },
        //     },
        // };

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
        doc.save('quotationListingReport.pdf');
    }

    // downloadQuotationReportListPdf() {
    //     console.log('Downloading Pdf....');
    //     let doc = new jsPDF('l', 'pt', 'a4');

    //     var company_logo = new Image();
    //     company_logo.src = 'assets/images/apluslogo.png';

    //     // A Plus General Insurance
    //     // Plot No. 402, Roma Park, Zambezi Road
    //     // P.O. Box 31700, Lusaka Zambia
    //     // Tel: +260 211 239865/6 - Tele/Fax:+260 211 239867
    //     // E-mail: info@aplusgeneral.com

    //     const totalPagesExp = '{total_pages_count_string}';

    //     var header = function (data) {
    //         doc.setFontSize(8);
    //         doc.setTextColor(40);
    //         doc.setFontStyle('normal');
    //     };

    //     doc.setFontSize(8);
    //     doc.setFontStyle('normal');

    //     var options = {
    //         beforePageContent: header,
    //         margin: {
    //             top: 50,
    //         },
    //         styles: {
    //             overflow: 'linebreak',
    //             fontSize: 8,
    //             rowHeight: 'auto',
    //             columnWidth: 'wrap',
    //         },
    //         columnStyles: {
    //             1: { columnWidth: 'auto' },
    //             2: { columnWidth: 'auto' },
    //             3: { columnWidth: 'auto' },
    //             4: { columnWidth: 'auto' },
    //             5: { columnWidth: 'auto' },
    //             6: { columnWidth: 'auto' },
    //             7: { columnWidth: 'auto' },
    //             8: { columnWidth: 'auto' },
    //             9: { columnWidth: 'auto' },
    //             10: { columnWidth: 'auto' },
    //             11: { columnWidth: 'auto' },
    //         },

    //     };
    //     // const elem = document.getElementById('table');
    //     // const data = doc.autoTableHtmlToJson(elem);
    //     // doc.autoTable( data.columns, data.rows, options);

    //     // Total page number plugin only available in jspdf v1.0+
    //     if (typeof doc.putTotalPages === 'function') {
    //         doc.putTotalPages(totalPagesExp);
    //     }

    //     //@ts-ignore
    //     doc.autoTable({
    //         html: 'Table',
    //         didDrawPage: options,
    //     });
    //     doc.save('quotationReport.pdf');
    // }

    downloadPDF(tableId: string, title: string) {
        console.log('downloading pdf...');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
            var name = 'A Plus General Insurance',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(name) *
                        doc.internal.getFontSize()) /
                        2;
            var address1 = 'Plot No. 402, Roma Park, Zambezi Road';
            var address2 = 'P.O. Box 31700, Lusaka Zambia';
            var phone = 'Tel: +260 211 239865/6 - Tele/Fax:+260 211 239867';
            var email = 'E-mail: info@aplusgeneral.com';
            // var text = title,
            //     xOffset =
            //         doc.internal.pageSize.width / 2 -
            //         (doc.getStringUnitWidth(text) *
            //             doc.internal.getFontSize()) /
            //             2;

            doc.setTextColor(173, 216, 230);
            // doc.text(name, xOffset, 40);
            doc.text(name, xOffset, 60);
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
        };

        const options = {
            beforePageContent: header,
            //   afterPageContent: footer,
            // margin: {
            //     top: 100,
            // },
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

        doc.setFontSize(15);

        //@ts-ignore
        doc.autoTable({
            html: tableId,
            margin: { top: 80 },
            didDrawPage: header,
        });
        // autoTable(doc, { html: '#Table' });
        doc.save(title + '.pdf');
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
            didDrawPage: options,
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
            var text = 'Renewal Report',
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
            didDrawPage: options,
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
            var text = 'Debit Note Report',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(text) *
                        doc.internal.getFontSize()) /
                        2;

            doc.setTextColor(173, 216, 230);
            doc.text(text, xOffset, 60);
            // doc.text(subtext, xOffset, 70)

            doc.setFontSize(11);
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
        };

        const head = [
            [
                'Client Name',
                'Transaction Date',
                'Underwriter',
                'Policy Number',
                'Intermediary',
                'Branch',
                'Class',
                'Product',
                'Sum Insured',
                'Premium',
                'Levy',
                'Commission',
                'Currency',
                'Endor. Type',
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
                150,
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
            doc.text(text, xOffset, 70);
            doc.text(text, xOffset, 80);
            doc.text(text, xOffset, 90);

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
    // toPdf function to print the pdfBody which is an array of jsonobjects holding the table data into pdf.

    parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // note parts[1]-1
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }

    _getFilterReportList(value) {
        let fromDate = value.fromDate;
        let toDate = value.toDate;

        // if (fromDate !== '' || toDate !== '') {
        // this.displayedMotor = this.motor;
        this.displayedMotor = this.motor.filter((date) => {
            let newDate = moment(date.dateCreated).format('YYYY-MM-DD');
            toDate = moment(toDate).format('YYYY-MM-DD');
            fromDate = moment(fromDate).format('YYYY-MM-DD');

            let tt = this.parseDate(toDate);
            let ff = this.parseDate(fromDate);

            let nn = this.parseDate(newDate);

            console.log('New Date', nn);
            console.log('date from form', ff, tt);

            if (newDate >= fromDate && newDate <= toDate) {
                return date;
            }

            console.log('hey am filter', this.displayedMotor);
        });

        this.displayedFilterMotor = this.filterMotor.filter((date) => {
            let newDate = moment(date.dateCreated).format('YYYY-MM-DD');
            toDate = moment(toDate).format('YYYY-MM-DD');
            fromDate = moment(fromDate).format('YYYY-MM-DD');

            let tt = this.parseDate(toDate);
            let ff = this.parseDate(fromDate);

            let nn = this.parseDate(newDate);

            console.log('New Date', nn);
            console.log('date from form', ff, tt);

            if (newDate >= fromDate && newDate <= toDate) {
                return date;
            }

            console.log('hey am filter', this.displayedFilterMotor);
        });

        this.displayPremiumReport = this.filterPremiumList.filter((date) => {
            let newDate = moment(date.startDate).format('YYYY-MM-DD');
            toDate = moment(toDate).format('YYYY-MM-DD');
            fromDate = moment(fromDate).format('YYYY-MM-DD');

            let tt = this.parseDate(toDate);
            let ff = this.parseDate(fromDate);

            let nn = this.parseDate(newDate);

            console.log('New Date', nn);
            console.log('date from form', ff, tt);

            if (newDate >= fromDate && newDate <= toDate) {
                return date;
            }

            console.log('hey am filter', this.displayPremiumReport);
        });

        // }

        //   this.quotationService.getMotorQuotations().subscribe((x) => {
        //         x.filter((d) => {
        //             d.dateCreated >= fromDate && d.dateCreated <= toDate;
        //         });
        //     });

        //    this.displayedMotor = this.quotationService.getMotorQuotations().subscribe((d) => {
        //         this.displayQuotationReport = d;

        //         this.filterPremiumReport = this.displayQuotationReport.filter(
        //             (x) => {
        //                 let myDate: moment.Moment = moment('2020-06-07');
        //                 myDate >= ff && myDate <= tt;
        //             }
        //         );

        //         console.log('hey am filter', this.filterPremiumReport);
        //     });

        // this.quotationService
        //     .getMotorQuotations()
        //     .pipe(
        //         map((premium) =>
        //             from(premium).pipe(
        //                 filter((d: MotorQuotationModel) => {
        //                     // let date = new Date(d.dateCreated)
        //                     let myDate: moment.Moment = moment('2020-06-09');
        //                     // let myDate: moment.Moment = moment(d.dateCreated, "YYYY-MM-DD");
        //                     // let mydate = d.dateCreated * 1000 | date:'yyyy-MM-dd';
        //                     console.log('This Old->', myDate);

        //                     return myDate >= ff && myDate <= tt;
        //                 })
        //             )
        //         ),
        //         tap((premium) =>
        //             premium.subscribe((d) => {
        //                 this.filterPremiumReport.push(d);
        //                 console.log(this.filterPremiumReport);
        //             })
        //         )
        //     )
        //     .subscribe();
    }

    downloadQuotationReportListExcel() {
        let element = document.getElementById('Table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    filterMotors(
        filter: 'All' | 'Agents' | 'Broker' | 'Sales Representative'
    ): void {
        switch (filter) {
            case 'All':
                this.displayedMotor = this.motor;
            case 'Agents':
                this.displayedMotor = this.motor.filter(
                    (x) => x.sourceOfBusiness == 'Agent'
                );
            case 'Broker':
                this.displayedMotor = this.motor.filter(
                    (x) => x.sourceOfBusiness == 'Broker'
                );
            case 'Sales Representative':
                this.displayedMotor = this.motor.filter(
                    (x) => x.sourceOfBusiness == 'Broker'
                );
        }
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayedFilterMotor = this.filterMotor;
            this.displayedMotor = this.motor;
            this.displayPremiumReport = this.filterPremiumList;
        }

        this.displayedMotor = this.motor.filter((motor) => {
            if (motor.sourceOfBusiness === 'direct') {
                return (
                    motor.quoteNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.grossPremium
                        .toFixed()
                        .includes(value.toLowerCase()) ||
                    motor.sumInsured.toFixed().includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase())
                );
            } else if (motor.sourceOfBusiness === 'broker') {
                return (
                    motor.quoteNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase())
                );
            } else {
                motor.quoteNumber.toLowerCase().includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase());
            }
        });

        this.displayedFilterMotor = this.filterMotor.filter((motor) => {
            if (motor.sourceOfBusiness === 'Agent') {
                return (
                    motor.quoteNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase())
                );
            } else if (motor.sourceOfBusiness === 'broker') {
                return (
                    motor.quoteNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase())
                );
            } else {
                motor.quoteNumber.toLowerCase().includes(value.toLowerCase()) ||
                    motor.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.status.toLowerCase().includes(value.toLowerCase()) ||
                    motor.branch.toLowerCase().includes(value.toLowerCase()) ||
                    motor.client.toLowerCase().includes(value.toLowerCase()) ||
                    motor.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    motor.basicPremiumSubTotal
                        .toString()
                        .includes(value.toLowerCase());
            }
        });

        this.displayPremiumReport = this.filterPremiumList.filter((policy) => {
            if (policy.sourceOfBusiness === 'direct') {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.status.toLowerCase().includes(value.toLowerCase()) ||
                    policy.branch.toLowerCase().includes(value.toLowerCase()) ||
                    policy.client.toLowerCase().includes(value.toLowerCase()) ||
                    policy.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.risks[0].productType
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.sumInsured
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.netPremium
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.levy.toString().includes(value.toLowerCase()) ||
                    policy.currency.toString().includes(value.toLowerCase())
                );
            } else if (policy.sourceOfBusiness === 'broker') {
                return (
                    policy.policyNumber
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.status.toLowerCase().includes(value.toLowerCase()) ||
                    policy.branch.toLowerCase().includes(value.toLowerCase()) ||
                    policy.client.toLowerCase().includes(value.toLowerCase()) ||
                    policy.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.risks[0].productType
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.sumInsured
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.netPremium
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.levy.toString().includes(value.toLowerCase()) ||
                    policy.currency.toString().includes(value.toLowerCase())
                );
            } else {
                policy.policyNumber
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                    policy.intermediaryName
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.status.toLowerCase().includes(value.toLowerCase()) ||
                    policy.branch.toLowerCase().includes(value.toLowerCase()) ||
                    policy.client.toLowerCase().includes(value.toLowerCase()) ||
                    policy.sourceOfBusiness
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    policy.risks[0].productType
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.sumInsured
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.netPremium
                        .toString()
                        .includes(value.toLowerCase()) ||
                    policy.levy.toString().includes(value.toLowerCase()) ||
                    policy.currency.toString().includes(value.toLowerCase()) ||
                    policy.commission.toString().includes(value.toLowerCase());
            }
        });
    }
}
