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

import { UsersService } from 'src/app/users/services/users.service';
import { UserModel } from 'src/app/users/models/users.model';

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
    getUser: string;
    getBranch: string;
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
    commission: number;
    getBranch: string;
    getUser: string;
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
    isRenewalReportVisible = false;
    isPremiumWorkingReportVisible = false;
    isDebitNoteReportVisible = false;
    isProductionReportVisible = false;
    isIntermediaryQuotationListingReport = false;
    isAnalysisReportVisible = false;
    isReportVisible = false;

    //search string when filtering clients
    searchString: string;

    motorList: MotorQuotationModel[] = [];
    motor: Motor[] = [];
    filterMotor: Motor[] = [];
    displayedMotor: Motor[] = [];
    displayedFilterMotor: Motor[] = [];

    policiesList: Policy[] = [];
    premiumReport: Policy[] = [];
    filteredPoliciesList: Policy[] = [];
    displayPremiumReport: Policy[] = [];
    filterPremiumList: Array<PremiumReport>;
    productionReport: Array<PremiumReport>;

    filterList: Array<IFormattedAnalysisReport>;

    dateForm: FormGroup;

    usersList: UserModel[];
    singleUser: UserModel[];

    commissionList: ICommissionSetup[] = [];

    isLoading = false;
    isOkLoading = false;

    timeDay = new Date();
    fileName = 'PremiumReportTable' + this.timeDay + '.xlsx';

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
        private userService: UsersService,
        private commissionService: CommisionSetupsService,
        private quotationService: QuotesService,
        private policiesService: PoliciesService,
        private formBuilder: FormBuilder
    ) {}

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
        this.isOkLoading = true;
        setTimeout(() => {
            this.isOkLoading = false;
        }, 3000);

        let sourceOfBusiness = 'direct';

        this.quotationService.getMotorQuotations().subscribe((d) => {
            this.motorList = d;
            this.motor = this.motorList.map((m) => ({
                ...m,
                sumInsured: this.sumArray(m.risks, 'sumInsured'),
                grossPremium: this.sumArray(m.risks, 'netPremium'),
                getBranch: this.getBranch(m.user),
                getUser: this.getUser(m.user),
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
                commission: this.getCommission(x.intermediaryName),
                getBranch: this.getBranch(x.user),
                getUser: this.getUser(x.user),
            }));

            this.displayPremiumReport = this.filterPremiumList;
            console.log('New Policy--->', this.filterPremiumList);

            this.productionReport = this.filterPremiumList.filter((x) =>
                x.sourceOfBusiness !== sourceOfBusiness
            );
            console.log('filter', this.productionReport);
        });

        this.userService.getUsers().subscribe((users) => {
            this.usersList = users;
            console.log('users');

            console.log('user:', this.usersList);
        });

        this.commissionService.getCommissionSetups().subscribe((commission) => {
            this.commissionList = commission;
            console.log('COMMISSION', this.commissionList);
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

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    capitalize(s) {
        return s.toLowerCase().replace(/\b./g, function (a) {
            return a.toUpperCase();
        });
    }

    getEmailName(email: string) {
        return email.replace(/@.*/, ' ');
    }

    // add(data) {
    //     this.value = data;
    //     for (let j = 0; j < data.length; j++) {
    //         this.sum += this.value[j].sumInsured;
    //     }
    // }

    getUser(email: string) {
        let nUser;
        console.log('users->', this.usersList);
        nUser = this.usersList.filter((x) => x.email === email);
        console.log('user', nUser);
        return nUser;
    }

    getBranch(email: string) {
        let nUser;
        nUser = this.usersList.filter((x) => x.email === email);
        console.log('branch', nUser);
        return nUser;
    }

    getCommission(intermediary: string){
        console.log('inter', intermediary);
        console.log('inter-commission', this.commissionList);
        let comm;

        comm = this.commissionList.filter(
            (x) => x.intermediaryName === intermediary
        );

        console.log('fcommf', comm);

        return comm;
    }

    getSumMotor(column): number {
        let sum = 0;
        for (let i = 0; i < this.displayedMotor.length; i++) {
            sum += this.displayedMotor[i][column];
        }
        return sum;
    }

    getTotalSumInsured() {
        return this.displayedFilterMotor
            .map((t) => t.sumInsured)
            .reduce((acc, value) => acc + value);
    }

    getSum(column): number {
        let sum = 0;
        for (let i = 0; i < this.displayPremiumReport.length; i++) {
            sum += this.displayPremiumReport[i][column];
        }
        return sum;
    }

    getCountNumber(name): number {
        let count;
        count = this.displayPremiumReport.filter((x) => {
            x.intermediaryName === name;
        }).length;

        return count;
    }
    getName(name) {
        return `${
            name.companyName
                ? name.companyName
                : name.contactFirstName + ' ' + name.contactLastName
        }`;
    }

    getCountQuotation(name): number {
        let count;
        count = this.displayedFilterMotor.filter((x) => {
            x.intermediaryName === name;
        }).length;

        return count;
    }

    getRatio(name): number {
        let nPolicy;
        let nQuotes;
        let results;

        nPolicy = this.displayPremiumReport.filter((x) => {
            x.intermediaryName === 'Bertha Muyunda';
            // name.companyName ? name.companyName : name.contactFirstName + " " + name.contactLastName
        }).length;

        nQuotes = this.displayedFilterMotor.filter((x) => {
            x.intermediaryName === 'Bertha Muyunda';
        }).length;

        results = (nPolicy / nQuotes) * 100;

        return results;
    }
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

    downloadPDF(tableId: string, title: string) {
        console.log('downloading pdf...');
        let doc = new jsPDF('l', 'pt', 'a4');
        var img = new Image();
        img.src = 'assets/images/apluslogo.png';

        var header = function (headerData: any) {
            var name = title,
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(name) *
                        doc.internal.getFontSize()) /
                        2;
            var address1 = 'Plot No. 402, Roma Park, Zambezi Road',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(address1) *
                        doc.internal.getFontSize()) /
                        2;
            // var address1 = 'Plot No. 402, Roma Park, Zambezi Road';
            var address2 = 'P.O. Box 31700, Lusaka Zambia',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(address2) *
                        doc.internal.getFontSize()) /
                        2;
            var phone = 'Tel: +260 211 239865/6 - Tele/Fax:+260 211 239867',
                xOffset =
                    doc.internal.pageSize.width / 2 -
                    (doc.getStringUnitWidth(phone) *
                        doc.internal.getFontSize()) /
                        2;
            var email = 'E-mail: info@aplusgeneral.com';
            // xOffset =
            //     doc.internal.pageSize.width / 2 -
            //     (doc.getStringUnitWidth(email) *
            //         doc.internal.getFontSize()) /
            //         2;

            doc.setTextColor(173, 216, 230);
            doc.text(address1, headerData.settings.margin.left + 550, 15);
            doc.text(address2, headerData.settings.margin.left + 550, 25);
            doc.text(phone, headerData.settings.margin.left + 550, 35);
            doc.text(email, headerData.settings.margin.left + 550, 45);
            doc.text(name, headerData.settings.margin.left + 550, 60);
            doc.setFontSize(15);
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

        doc.setFontSize(10);

        //@ts-ignore
        doc.autoTable({
            html: tableId,
            margin: { top: 80 },
            styles: {
                overflow: 'linebreak',
                fontSize: 8,
                tableWidth: 'auto',
                columnWidth: 'auto',
            },
            didDrawPage: header,
        });

        doc.save(title + this.timeDay + '.pdf');
    }

    parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // note parts[1]-1
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }

    _getFilterMotorReportList(value) {
        let fromDate = value.fromDate;
        let toDate = value.toDate;
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
                    (x) => x.sourceOfBusiness == 'Sales Representative'
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
