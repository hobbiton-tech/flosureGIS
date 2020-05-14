import { Component, OnInit, Input } from '@angular/core';
import { Policy } from '../../models/policy.model';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
    selector: 'app-policy-credit-note-document',
    templateUrl: './policy-credit-note-document.component.html',
    styleUrls: ['./policy-credit-note-document.component.scss']
})
export class PolicyCreditNoteDocumentComponent implements OnInit {
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
    creditNoteAmount: number;

    @Input()
    risk: RiskModel;

    @Input()
    policy: Policy;

    constructor() {}

    generatingPDF = false;

    ngOnInit(): void {}

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('creditPrintSection');
        const options = {
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth
        };

        html2canvas(div, options).then(canvas => {
            let doc = new jsPDF({
                unit: 'px',
                format: 'a4'
            });
            let imgData = canvas.toDataURL('image/PNG');
            doc.addImage(imgData, 'PNG', 0, 0);

            let pdfOutput = doc.output();
            let buffer = new ArrayBuffer(pdfOutput.length);
            let array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }
            const fileName = 'policy-creditNote.pdf';
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }
}
