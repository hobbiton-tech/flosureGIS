import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PremiumService } from '../../services/premium.service';
import { MotorQuotationModel } from 'src/app/quotes/models/quote.model';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NzDrawerPlacement } from 'ng-zorro-antd';
import {
    IAgent,
    IBroker,
    ISalesRepresentative,
} from 'src/app/settings/components/agents/models/agents.model';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';
import { QuotesService } from 'src/app/quotes/services/quotes.service';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
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
    selector: 'app-claims',
    templateUrl: './claims.component.html',
    styleUrls: ['./claims.component.scss'],
})
export class ClaimsComponent implements OnInit {
    isVisible = false;
    visible = false;

    isAnalysisReportVisible = false;
    isReportVisible = false;

    //Qoutation Listing Report
    displayQuotationReport: MotorQuotationModel[];

    displayPolicyReport: Policy[];

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

    isOutstandingClaimsReportVisible = false;
    isPaidClaimsReportVisible= false;
    isServiceProvidersReportVisible = false;
    isClaimsStatusReportVisible = false;
    isSalvageReportVisible = false;
    isRecoveriesReportVisible = false;
    isClaimsExperienceReportVisible = false;

    // displayAnalysisReport: Array<MotorQuotationModel>;
    // // filterMotorQuotation: Array<FilterMotorQuotation>;
    // filterMotorQuotation: any;
    // dataTest: any;

    ///formgroug///
    dateForm: FormGroup;

    constructor(
        private premiumService: PremiumService,
        private agentsService: AgentsService,
        private quotationService: QuotesService,
        private policiesService: PoliciesService
    ) {}

    showOutstandingClaimsModal(){
        this.isOutstandingClaimsReportVisible = true;
    }

    showPaidClaimsReportModal() {
        this.isPaidClaimsReportVisible = true;
    }

    showServiceProvidersModal() {
        this.isServiceProvidersReportVisible = true;
    }

    showClaimsStatusReportModal() {
        this.isClaimsStatusReportVisible = true;
    }

    showSalvageReportModal() {
        this.isSalvageReportVisible = true;
    }

    showRecoveryReportModal() {
        this.isRecoveriesReportVisible = true;
    }

    showClaimsExperienceReportModal(){
        this.isClaimsExperienceReportVisible = true;
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
        this.isOutstandingClaimsReportVisible = false;
        this.isPaidClaimsReportVisible= false;
        this.isServiceProvidersReportVisible = false;
        this.isClaimsStatusReportVisible = false;
        this.isSalvageReportVisible = false;
        this.isRecoveriesReportVisible = false;
        this.isClaimsExperienceReportVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isOutstandingClaimsReportVisible = false;
        this.isPaidClaimsReportVisible= false;
        this.isServiceProvidersReportVisible = false;
        this.isClaimsStatusReportVisible = false;
        this.isSalvageReportVisible = false;
        this.isRecoveriesReportVisible = false;
        this.isClaimsExperienceReportVisible = false;
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

    //Quotation Listing Report functions

    //     downloadPDF() {
    // // const today = moment()

    //         console.log('Downloading Pdf....');
    //         let doc = new jsPDF('l', 'pt', 'a4');
    //         var img = new Image();
    //         img.src = 'assets/images/apluslogo.png';

    //         var header = function (headerData: any) {
    //             var text = 'A Plus General Insurance',
    //                 xOffset =
    //                     doc.internal.pageSize.width / 2 -
    //                     (doc.getStringUnitWidth(text) *
    //                         doc.internal.getFontSize()) /
    //                         2;
    //             doc.setTextColor(173, 216, 230);
    //             doc.text(text, xOffset, 60);

    //             doc.setFontSize(25);
    //             doc.setTextColor(40);
    //             doc.setFontStyle('normal');
    //             doc.addImage(
    //                 img,
    //                 'PNG',
    //                 headerData.settings.margin.left,
    //                 20,
    //                 60,
    //                 60
    //             );
    //         };

    //         const head = [
    //             [
    //                 '#',
    //                 'Quotation #',
    //                 'Client',
    //                 'Transaction Date',
    //                 'Underwriter',
    //                 'Intermediary Name',
    //                 'Branch',
    //                 'Source of Business',
    //                 'Product Type',
    //                 'Sum Insured',
    //                 'Gross Premium',
    //                 'Status',
    //             ],
    //         ];

    //         const options = {
    //             beforePageContent: header,
    //             //   afterPageContent: footer,
    //             margin: {
    //                 top: 100,
    //             },
    //             head: head,
    //             styles: {
    //                 overflow: 'linebreak',
    //                 fontSize: 10,
    //                 tableWidth: 'auto',
    //                 columnWidth: 'auto',
    //             },
    //             columnStyles: {
    //                 1: { columnWidth: 'auto' },
    //             },
    //         };

    //         doc.setFontSize(19);
    //         //@ts-ignore
    //         doc.autoTable({
    //             html: 'Table',
    //             margin: { top: 80 },
    //             didDrawPage: header,
    //         });
    //         doc.save('QuotationReport.pdf');
    //     }

    // downloadPdfTest2() {
    //     this.premiumService.generateQuotationReport().subscribe((premium) => {
    //         this.displayAnalysisReport = premium;

    //         this.filterMotorQuotation = this.displayAnalysisReport.filter(
    //             (x) => ({
    //                 ...x,
    //                 client: x.client,
    //                 quoteNumber: x.quoteNumber,
    //                 dateCreated: x.dateCreated,
    //                 branch: x.branch,
    //                 status: x.status,
    //                 basicPremiumSubTotal: x.basicPremiumSubTotal,
    //                 sourceOfBusiness: x.sourceOfBusiness,
    //                 intermediaryName: x.intermediaryName,
    //                 productType: 'Motor',
    //             })
    //         );
    //         console.log('This quotation->', this.filterMotorQuotation);
    //     });

    //     console.log('Downloading Pdf....');
    //     let doc = new jsPDF('l', 'pt', 'a4');
    //     var img = new Image();
    //     img.src = 'assets/images/apluslogo.png';
    //     // let imgData = 'data:image/png;base64, '+ Base64.encode();
    //     // console.log(imgData);

    //     // doc.addImage(img, 'PNG', 10, 10, 280, 280);

    //     var header = function (headerData: any) {
    //         var text = 'A Plus General Insurance',
    //             xOffset =
    //                 doc.internal.pageSize.width / 2 -
    //                 (doc.getStringUnitWidth(text) *
    //                     doc.internal.getFontSize()) /
    //                     2;
    //         doc.setTextColor(173, 216, 230);
    //         doc.text(text, xOffset, 60);

    //         doc.setFontSize(25);
    //         doc.setTextColor(40);
    //         doc.setFontStyle('normal');
    //         doc.addImage(
    //             img,
    //             'PNG',
    //             headerData.settings.margin.left,
    //             20,
    //             60,
    //             60
    //         );

    //         // doc.text('Aplus Insurance', 60, 40, 250, 'center');
    //         // const currentdate = new Date();
    //         // const datetime =
    //         //     currentdate.getDate() +
    //         //     '/' +
    //         //     (currentdate.getMonth() + 1) +
    //         //     '/' +
    //         //     currentdate.getFullYear();
    //         // doc.text(
    //         //     'Date: ' + datetime,
    //         //     headerData.settings.margin.left + 400,
    //         //     60
    //         // );
    //         // doc.setFontSize(5);
    //     };

    //     const head = [
    //         [
    //             '#',
    //             'Client',
    //             'Transaction Date',
    //             'Underwriter',
    //             'Quotation #',
    //             'Intermediary Name',
    //             'Branch',
    //             'Source of Business',
    //             'Product Type',
    //             'Sum Insured',
    //             'Gross Premium',
    //             'Status',
    //         ],
    //     ];

    //     const totalPagesExp = '{total_pages_count_string}';

    //     const options = {
    //         beforePageContent: header,
    //         //   afterPageContent: footer,
    //         margin: {
    //             top: 100,
    //         },
    //         head: head,
    //         styles: {
    //             overflow: 'linebreak',
    //             fontSize: 10,
    //             tableWidth: 'auto',
    //             columnWidth: 'auto',
    //         },
    //         columnStyles: {
    //             1: { columnWidth: 'auto' },
    //         },
    //     };

    //     // const elem = document.getElementById('table');
    //     // const data = doc.autoTableHtmlToJson(elem);
    //     // doc.autoTable( data.columns, data.rows, options);

    //     // Total page number plugin only available in jspdf v1.0+
    //     if (typeof doc.putTotalPages === 'function') {
    //         doc.putTotalPages(totalPagesExp);
    //     }

    //     //    doc.autoTable(columns, rows);
    //     doc.setFontSize(19);

    //     //@ts-ignore
    //     // doc.autoTable({ html: 'Table' });
    //     // doc.autoTable({
    //     //     html: 'Table',
    //     //     margin: { top: 80 },
    //     //     didDrawPage: header,
    //     // });
    //     //@ts-ignore
    //     // doc.table(
    //     //     [this.filterMotorQuotation]
    //     //     // didDrawPage: header,
    //     // );

    //     doc.table(20, 100, [this.filterMotorQuotation]);
    //     // doc.autoTable(this.filterMotorQuotation);
    //     doc.save('intermediary' + new Date() + '.pdf');
    // }

    // ddownloadPdf() {
    //     this.premiumService.generateQuotationReport().subscribe((premium) => {
    //         this.displayAnalysisReport = premium;

    //         this.filterMotorQuotation = this.displayAnalysisReport.map((x) => ({
    //             ...x,
    //             client: x.client,
    //             quoteNumber: x.quoteNumber,
    //             dateCreated: x.dateCreated,
    //             branch: x.branch,
    //             status: x.status,
    //             basicPremiumSubTotal: x.basicPremiumSubTotal,
    //             sourceOfBusiness: x.sourceOfBusiness,
    //             intermediaryName: x.intermediaryName,
    //             productType: 'Motor',
    //         }));

    //         // this.displayAnalysisReport.intermediaryName;
    //         // this.displayAnalysisReport.quoteNumber;

    //         var doc = new jsPDF('l', 'pt', 'a4');
    //         var img = new Image();
    //         img.src = 'assets/images/apluslogo.png';

    //         var header = function (headerData: any) {
    //             var text = 'A Plus General Insurance',
    //                 xOffset =
    //                     doc.internal.pageSize.width / 2 -
    //                     (doc.getStringUnitWidth(text) *
    //                         doc.internal.getFontSize()) /
    //                         2;
    //             doc.setTextColor(173, 216, 230);
    //             doc.text(text, xOffset, 60);

    //             doc.addImage(
    //                 img,
    //                 'PNG',
    //                 headerData.settings.margin.left,
    //                 20,
    //                 60,
    //                 60
    //             );
    //         };

    //         const head = [
    //             [
    //                 'Quotation Number',
    //                 'Client',
    //                 'Transaction Date',
    //                 'Underwriter',
    //                 'Intermediary Name',
    //                 'Branch',
    //                 'Source of Business',
    //                 'Product Type',
    //                 'Sum Insured',
    //                 'Gross Premium',
    //                 'Status',
    //             ],
    //         ];

    //         const options = {
    //             beforePageContent: header,
    //             margin: {
    //                 top: 100,
    //             },
    //             head: head,
    //             styles: {
    //                 overflow: 'linebreak',
    //                 fontSize: 10,
    //                 tableWidth: 'auto',
    //                 columnWidth: 'auto',
    //             },
    //             columnStyles: {
    //                 1: { columnWidth: 'auto' },
    //             },
    //         };

    //         doc.setFontSize(19);
    //         //@ts-ignore
    //         doc.autoTable({
    //             head: [['Name', 'Email', 'Country']],
    //             body: [
    //                 ['David', 'david@example.com', 'Sweden'],
    //                 ['Castille', 'castille@example.com', 'Spain'],
    //             ],
    //         });

    //         doc.save('intermediary.pdf');
    //     });

    //     console.log('Downloading Pdf....');
    //     console.log('Button ok clicked!');
    // }

    downloadQuotationReportListPdf() {
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
