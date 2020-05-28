import { Component, OnInit, Input } from '@angular/core';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    IPolicyClauses,
    IPolicyWording,
    IPolicyExtension,
} from 'src/app/settings/models/underwriting/clause.model';

@Component({
    selector: 'app-policy-wording',
    templateUrl: './policy-wording.component.html',
    styleUrls: ['./policy-wording.component.scss'],
})
export class PolicyWordingComponent implements OnInit {
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
        const div = document.getElementById('wordingPrintSection');
        const options = {
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth,
        };

        html2canvas(div, options).then((canvas) => {
            let doc = new jsPDF({
                unit: 'px',
                format: 'a4',
            });
            let imgData = canvas.toDataURL('image/PNG');
            doc.addImage(imgData, 'PNG', 0, 0);

            let pdfOutput = doc.output();
            let buffer = new ArrayBuffer(pdfOutput.length);
            let array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }
            const fileName = 'policy-wordingNote.pdf';
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
