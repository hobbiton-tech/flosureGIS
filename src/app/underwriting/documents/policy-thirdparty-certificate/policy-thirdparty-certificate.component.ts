
import { Risks } from './../../../reports/model/quotation.model';
import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { RiskModel, ITimestamp } from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import moment from 'moment';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { CoverNote } from '../models/documents.model';

@Component({
    selector: 'app-policy-thirdparty-certificate',
    templateUrl: './policy-thirdparty-certificate.component.html',
    styleUrls: ['./policy-thirdparty-certificate.component.scss'],
})
export class PolicyThirdpartyCertificateComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    receipt: IReceiptModel;

    @Input()
    clientNumber: string;

    @Input()
    coverNot: CoverNote;

    @Input()
    clientEmail: string;

    @Input()
    basicPremium: string;

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
    issueDate: string;

    @Input()
    issueTime: string;

    @Input()
    policyNumber: string;

    @Input()
    Risks: string;

    @Input()
    policy: Policy;

    subTotal: number;

    generatingPDF = false;

    dateOfIssue = new Date();
    constructor() {}

    ngOnInit(): void {
        this.subTotal = this.sumArray(this.policy.risks, 'basicPremium');
    }

    getYearOfManufacture(risk: RiskModel) {
        const year: string = moment(risk.yearOfManufacture).year().toString();
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
            onclone: (doc) => {
                doc.querySelector('div').style.transform = 'none';
            },
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth,
        };

        html2canvas(div, options).then((canvas) => {
            // Initialize JSPDF
            const doc = new jsPDF({
                unit: 'px',
                format: 'a4',
            });
            // Converting canvas to Image
            const imgData = canvas.toDataURL('image/PNG');
            // Add image Canvas to PDF
            doc.addImage(imgData, 'PNG', 0, 0);

            const pdfOutput = doc.output();
            // using ArrayBuffer will allow you to put image inside PDF
            const buffer = new ArrayBuffer(pdfOutput.length);
            const array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }

            // Name of pdf
            const fileName = 'policy-certificate.pdf';

            // Make file
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }

    convertRiskDate(risk: RiskModel): number {
        return (risk.riskStartDate as ITimestamp).seconds * 1000;
    }

    sumArray(items, prop) {
        // tslint:disable-next-line: only-arrow-functions
        return items.reduce(function(a, b) {
            return a + b[prop];
        }, 0);
    }
}
