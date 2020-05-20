import { Component, OnInit, Input } from '@angular/core';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-policy-schedule-document',
    templateUrl: './policy-schedule-document.component.html',
    styleUrls: ['./policy-schedule-document.component.scss']
})
export class PolicyScheduleDocumentComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    policyRisk: RiskModel;

    @Input()
    issueDate: string;

    @Input()
    issueTime: string;

    @Input()
    policyNumber: string;

    @Input()
    policy: Policy;

    @Input()
    basicPremium: string;

    @Input()
    loadingAmount: string;

    @Input()
    discountAmount: string;

    @Input()
    totalAmount: string;

    @Input()
    coverFrom: string;

    @Input()
    coverTo: string;

    constructor() {}

    generatingPDF = false;

    ngOnInit(): void {}

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('debitPrintSection');
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
            const fileName = 'policy-debitNote.pdf';
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }
}
