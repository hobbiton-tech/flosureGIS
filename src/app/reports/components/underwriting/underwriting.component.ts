import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

import * as moment from 'moment';

import * as XLSX from 'xlsx';
import { PolicyDto } from '../../model/quotation.model';
import { DebitNote } from 'src/app/underwriting/documents/models/documents.model';
import _ from 'lodash';

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

interface Motor extends MotorQuotationModel{
    sumInsured: number;
    grossPremium: number;
}

interface PremiumReport extends Policy {
    policyNumber: string;
    // debitNote: any;
    grossPremium: string;
    loading: number;
    discount: number;
    netPremium: number;
    levy: number;
    premiumDue: number;
}

export type QuoteStatus = 'Draft' | 'Approved';

interface IFormattedAnalysisReport
    extends IAgent,
        IBroker,
        ISalesRepresentative {
    getFullName: string;
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

    //search string when filtering clients
    searchString: string;

    isAnalysisReportVisible = false;
    isReportVisible = false;

    //Qoutation Listing Report
    displayQuotationReport: MotorQuotationModel[];
    motorList: MotorQuotationModel[];
    motor: Motor[];

    displayPolicyReport: Policy[] = [];
    policyList: Policy[] = [];

    displayDebitNote: DebitNote[] = [];
    debitNoteList: DebitNote[] = [];
    filterNote: DebitNote[] = [];

    // Quotation Analysis Report
    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    formatIntermediaryReport: Array<IFormattedAnalysisReport>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    policiesList: Policy[];
    filteredPoliciesList: Policy[] = [];
    filterPremiumList: Array<PremiumReport>;

    quotesList: MotorQuotationModel[];
    filteredQuotesList: MotorQuotationModel[] = [];

    // renewal report
    isRenewalReportVisible = false;

    isPremiumWorkingReportVisible = false;
    isDebitNoteReportVisible = false;
    isProductionReportVisible = false;
    isIntermediaryQuotationListingReport = false;

    dateForm: FormGroup;

    timeDay = new Date();
    fileName = 'PremiumReportTable' + this.timeDay + '.xlsx';


    filterPremiumReport: any;
    displayPremiumReport: Policy[];

    constructor(
        private premiumService: PremiumService,
        private agentsService: AgentsService,
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

    // sum up specific values in array
    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }

    ngOnInit(): void {
        // this._getFilterReportList(t, f);

        this.quotationService.getMotorQuotations().subscribe((d) => {
            this.motorList = d;
            this.motor = this.motorList.map((m) => ({
                ...m,
                sumInsured: this.sumArray(m.risks, 'sumInsured'),
                grossPremium: this.sumArray(m.risks, 'basicPremium'),    
            }));
            console.log('Motor--->', this.displayQuotationReport);
        });

        let sourceOfBusiness = 'direct';

        this.quotationService.getMotorQuotations().subscribe((d) => {
            this.displayQuotationReport = d;

            this.filteredQuotesList = this.displayQuotationReport.filter(
                (x) => x.sourceOfBusiness !== sourceOfBusiness
            );

            this.displayQuotationReport = this.filteredQuotesList;
            // console.log(this.filteredQuotesList)

            console.log('Am filter--->', this.filteredQuotesList);
        });

        this.policiesService.getPolicies().subscribe((policies) => {
            this.displayPolicyReport = policies;
            console.log('Policy--->', this.displayPolicyReport);
        });

        this.policiesService.getPolicies().subscribe((policies) => {
            this.displayPolicyReport = policies;
        });

        // this.premiumService.getDebitNotes().subscribe((debit) => {
        //     this.displayDebitNote = debit;
        // });

        console.log('debit', this.displayDebitNote);

        this.policiesService.getPolicies().subscribe((policy) => {
            this.displayPremiumReport = policy;
            this.filterPremiumList = this.displayPremiumReport.map((x) => ({
                ...x,
                policyNumber: x.policyNumber,
                // debitNote: this.getDebitNote(x.id),
                grossPremium: this.sumArray(x.risks, 'basicPremium'),
                loading: this.sumArray(x.risks, 'loadingTotal'),
                discount: this.sumArray(x.risks, 'discountTotal'),
                netPremium: this.sumArray(x.risks, 'netPremium'),
                levy: this.sumArray(x.risks, 'premiumLevy'),
                premiumDue: x.sumInsured,
            }));

            this.displayPremiumReport = this.filterPremiumList;
            console.log('New Policy', this.filterPremiumList);
        });

        // var hash = Object.create(null);
        // this.displayPolicyReport.concat(this.displayDebitNote).forEach(function(obj) {
        //     hash[obj.id] = Object.assign(hash[obj.id] || {}, obj);
        // });
        // var a3 = Object.keys(hash).map(function(key) {
        //     return hash[key];
        // });

        // var merge = (Policy, DebitNote) => ({...Policy, ...DebitNote});
        // _.zipWith(this.displayPolicyReport, this.displayDebitNote, merge)

        var merged = _.map(this.displayPolicyReport, function (item) {
            return _.assign(
                item,
                _.find(this.displayDebitNote, ['id', item.id])
            );
        });

        console.log('Merged objects->', merged);

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

    // getDebitNote(id: string) {
    //     this.premiumService.getDebitNotes().subscribe((x) => {
    //         this.debitNoteList = x;
    //         // this.filterNote = this.debitNoteList.filter(
    //         //     // (x) => x.policy == id
    //         // );
    //     });
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
    getFullName(i: any): any {
        return `${
            i.companyName
                ? i.companyName
                : i.contactFirstName + '' + i.contactLastName
        }`;
    }

    getIntermediaryQuoteCount(intermediary: any): number {
        this.quotationService.getMotorQuotations().subscribe((quotes) => {
            this.quotesList = quotes;

            this.filteredQuotesList = this.quotesList.filter((x) =>
                x.intermediaryName == intermediary.companyName
                    ? intermediary.companyName
                    : intermediary.contactFirstName +
                      ' ' +
                      intermediary.contactLastName
            );
        });
        console.log('-------->-->->', this.filteredQuotesList)
        return this.filteredQuotesList.length;
    }

    getIntermediaryPolicyCount(intermediary: any): number {
        this.policiesService.getPolicies().subscribe((policies) => {
            console.log(policies);

            this.policiesList = policies;
            this.filteredPoliciesList = this.policiesList.filter((x) =>
                x.intermediaryName === intermediary.companyName
                    ? intermediary.companyName
                    : intermediary.contactFirstName +
                      ' ' +
                      intermediary.contactLastName
            );
        });

        // console.log('=>>>>' + this.filteredPoliciesList.length);

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

    _getFilterReportList() {
        let toDate = new Date(this.dateForm.get('toDate').value);
        let fromDate = new Date(this.dateForm.get('fromDate').value);

        let t = JSON.stringify(toDate);
        t = t.slice(1, 11);

        let f = JSON.stringify(fromDate);
        f = f.slice(1, 11);

        let ff: moment.Moment = moment(f);
        let tt: moment.Moment = moment(t);

        console.log('this->day', ff, tt);

        if (fromDate !== null || (!fromDate && toDate !== null) || !toDate) {
            this.displayQuotationReport = this.filterPremiumReport;
        }

        this.quotationService
            .getMotorQuotations()
            .pipe(
                map((premium) =>
                    from(premium).pipe(
                        filter((d: MotorQuotationModel) => {
                            // let date = new Date(d.dateCreated)
                            let myDate: moment.Moment = moment(d.dateCreated);
                            console.log('This Old->', myDate);

                            return myDate >= ff && myDate <= tt;
                        })
                    )
                ),
                tap((premium) =>
                    premium.subscribe((d) => {
                        this.filterPremiumReport.push(d);
                        console.log(this.filterPremiumReport);
                    })
                )
            )
            .subscribe();
    }

    downloadQuotationReportListExcel() {
        let element = document.getElementById('Table');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    search(value: string): void {
        if (value === '' || !value) {
            this.displayQuotationReport = this.motorList;
        }

        this.displayQuotationReport = this.motorList.filter((motor) => {
            if (motor.sourceOfBusiness === 'agent') {
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
    }
}
