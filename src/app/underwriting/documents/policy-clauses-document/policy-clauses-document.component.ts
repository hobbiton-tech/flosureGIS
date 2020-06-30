import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
} from 'src/app/settings/models/underwriting/clause.model';
import { Policy } from '../../models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';

@Component({
    selector: 'app-policy-clauses-document',
    templateUrl: './policy-clauses-document.component.html',
    styleUrls: ['./policy-clauses-document.component.scss'],
})
export class PolicyClausesDocumentComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    agency: string;

    @Input()
    policyNumber: string;

    @Input()
    classOfBusiness: string;

    @Input()
    coverFrom: string;

    @Input()
    coverTo: string;

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
    policy: Policy;

    @Input()
    policyClauses: IPolicyClauses;

    @Input()
    policyWording: IPolicyWording;

    @Input()
    policyExtension: IPolicyExtension;

    subTotal: number;
    generatingPDF = false;

    constructor() {}

    ngOnInit(): void {}

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('clauses');
        const options = {
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth,
        };

        html2canvas(div, options).then((canvas) => {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
            });
            const imgData = canvas.toDataURL('image/PNG');
            doc.addImage(imgData, 'PNG', 0, 0, 211, 298);

            const pdfOutput = doc.output();
            const buffer = new ArrayBuffer(pdfOutput.length);
            const array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }
            const fileName = `${this.policy.policyNumber}-clausesNote.pdf`;
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}
