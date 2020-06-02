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
    fileNameIntermediary = 'IntermediaryReport.xlsx'
    fileNameAnalysis = 'AnalysisReport.xlsx'

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

        this.agentsService
            .getAllIntermediaries()
            .subscribe((intermediaries) => {
                this.intermediariesList = [
                    ...intermediaries[0],
                    ...intermediaries[1],
                    ...intermediaries[2],
                ] as Array<IAgent & IBroker & ISalesRepresentative>;

                this.displayIntermediariesList = this.intermediariesList;
                // console.log('=========>', this.displayIntermediariesList);

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

    getIntermediaryQuoteCount(intermediary: any): number {
        this.premiumService.generateQuoteReport().subscribe((quotes) => {
            this.quotesList = quotes;

            this.filteredQuotesList = this.quotesList.filter((x) =>
                x.intermediaryName == intermediary.companyName
                    ? intermediary.companyName
                    : intermediary.contactFirstName +
                      ' ' +
                      intermediary.contactLastName
            );

            console.log('QuotesList', this.quotesList);
            console.log('filterQuotes=> ', this.filteredQuotesList.length);
        });

        return this.filteredPoliciesList.length;
    }

    // getIntermediaryPolicyCount(ntermediary: Moto)

    getIntermediaryPolicyCount(intermediary: any): number {
        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            this.filteredPoliciesList = this.policiesList.filter(
                (x) => x.intermediaryName == intermediary.companyName
            );
        });
        console.log('=>>>>' + this.filteredPoliciesList.length);
        return this.filteredPoliciesList.length;
    }

    getRatio(intermediary: any): number {
        this.policiesService.getPolicies().subscribe((policies) => {
            this.policiesList = policies;
            this.filteredPoliciesList = this.policiesList.filter(
                (x) => x.intermediaryName == intermediary.companyName
            );
        });

        this.quotationService.getMotorQuotations().subscribe((policies) => {
            this.quotesList = policies;
            this.filteredQuotesList = this.quotesList.filter(
                (x) => x.intermediaryName == intermediary.companyName
            );
        });
        // console.log('Get=>>>>' + this.filteredQuotesList.length);
        // console.log('Count=>>>>' + this.filteredPoliciesList.length);

        let policyNumber = this.filteredPoliciesList.length;
        let quoteNumber = this.filteredQuotesList.length;

        return (policyNumber / quoteNumber) * 100;
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
