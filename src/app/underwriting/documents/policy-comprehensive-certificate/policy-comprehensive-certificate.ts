import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    RiskModel,
    ITimestamp,
    DiscountModel,
    Excess,
    LimitsOfLiability
} from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import moment from 'moment';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { CoverNote } from '../models/documents.model';

@Component({
    selector: 'app-policy-comprehensive-certificate',
    templateUrl: './policy-comprehensive-certificate.component.html',
    styleUrls: ['./policy-comprehensive-certificate.component.scss']
})
export class PolicyComprehensiveCertificateComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    clientAddress: string;

    @Input()
    excessListCert: Excess[] = [];

    @Input()
    limitsOfLiablityCert: LimitsOfLiability[] = [];

    @Input()
    cndAmount = 0;

    @Input()
    basicPremium: string;

    @Input()
    receipt: IReceiptModel;

    @Input()
    loadingAmount: string;

    @Input()
    discountAmount: string;

    @Input()
    totalAmount: string;

    @Input()
    premiumLevy: string;

    @Input()
    policyRisk: RiskModel;

    @Input()
    excessList: Excess[];

    @Input()
    limitsOfLiablity: LimitsOfLiability[] = [];

    @Input()
    issueDate: string;

    @Input()
    issueTime: string;

    @Input()
    combInfo: string;
    @Input()
    combAmount: number;
    @Input()
    proDInfo: string;
    @Input()
    propDAmount: number;
    @Input()
    deathPEInfo: string;
    @Input()
    deathPEAmount: number;
    @Input()
    deathPPInfo: string;
    @Input()
    deathPPAmount: number;

    @Input()
    fExcexxType: string;
    @Input()
    fExcessAmount: number;
    @Input()
    sExcessType: string;
    @Input()
    sExcessAmount: number;
    @Input()
    tExcessType: string;
    @Input()
    tExcessAmount: number;

    @Input()
    policyNumber: string;

    @Input()
    policy: Policy;
    @Input()
    coverNot: CoverNote;

    subTotal: number;

    generatingPDF = false;
    dateOfIssue = new Date();
    limits: LimitsOfLiability;
    comb: LimitsOfLiability;
    deathPE: LimitsOfLiability;
    deathPP: LimitsOfLiability;
    propertyD: LimitsOfLiability;
    firstExcess: Excess;
    secondExcess: Excess;
    thirdExcess: Excess;
    co = false;
    pe = false;
    pp = false;
    pd = false;
    tppd: boolean;
    excT1 = '';
    excA1 = 0;
    excT2 = '';
    excA2 = 0;
    excT3 = '';
    excA3 = 0;

    constructor() {}

    ngOnInit(): void {
        this.excT1 = this.excessList[0] ? this.excessList[0].excessType : '-';
        this.excT2 = this.excessList[1] ? this.excessList[1].excessType : '-';
        this.excT3 = this.excessList[2] ? this.excessList[2].excessType : '-';

        this.excA1 = this.excessList[0] ? this.excessList[0].amount : 0;
        this.excA2 = this.excessList[1] ? this.excessList[1].amount : 0;
        this.excA3 = this.excessList[2] ? this.excessList[2].amount : 0;
    }

    getYearOfManufacture(risk: RiskModel) {
        let year: string = moment(risk.yearOfManufacture)
            .year()
            .toString();
        return year;
    }
    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('printSection');
        // const options = {
        //     scale: 1.32,
        //     allowTaint: true,
        //     onclone: (doc) => {
        //         doc.querySelector('div').style.transform = 'none';
        //     },
        // };
        const options = {
            scale: 1.32,
            allowTaint: true,
            onclone: doc => {
                doc.querySelector('div').style.transform = 'none';
            },
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth
        };

        html2canvas(div, options).then(canvas => {
            //Initialize JSPDF
            let doc = new jsPDF({
                unit: 'px',
                format: 'a4'
            });
            //Converting canvas to Image
            let imgData = canvas.toDataURL('image/PNG');
            //Add image Canvas to PDF
            doc.addImage(imgData, 'PNG', 0, 0);

            let pdfOutput = doc.output();
            // using ArrayBuffer will allow you to put image inside PDF
            let buffer = new ArrayBuffer(pdfOutput.length);
            let array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }

            //Name of pdf
            const fileName = 'policy-certificate.pdf';

            // Make file
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }

    // convertRiskDate(risk: RiskModel): number {
    //     return (risk.riskStartDate as ITimestamp).seconds * 1000;
    // }

    sumArray(items, prop) {
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }
}
