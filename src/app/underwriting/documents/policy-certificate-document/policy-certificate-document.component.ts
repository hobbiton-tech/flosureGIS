import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as canvg from 'canvg';
import { RiskModel, ITimestamp } from 'src/app/quotes/models/quote.model';

@Component({
    selector: 'app-policy-certificate-document',
    templateUrl: './policy-certificate-document.component.html',
    styleUrls: ['./policy-certificate-document.component.scss'],
})
export class PolicyCertificateDocumentComponent implements OnInit {
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

    generatingPDF = false;

    constructor() {}

    ngOnInit(): void {}

    gotToPrint(): void {}

    convertToPDF(): void {
        let svg = document.getElementById('certificate');
        // svg = svg.replace(/\r?\n|\r/g, '').trim();
        let canvas = document.createElement('canvas');
        // let some = canvg.Canvg.from(canvas.getContext('2d'), svg);
        let imageData = canvas.toDataURL('image/png');
        let doc = new jsPDF();
        doc.addImage(imageData, 'PNG', 0, 0);
        doc.save('cerficate');
    }

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('printSection');
        const options = {
            scale: 1.32,
            allowTaint: true,
            onclone: (doc) => {
                doc.querySelector('div').style.transform = 'none';
            },
        };

        html2canvas(div, options).then((canvas) => {
            //Initialize JSPDF
            let doc = new jsPDF({
                unit: 'px',
                format: 'a4',
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

    convertRiskDate(risk: RiskModel): number {
        return (risk.riskStartDate as ITimestamp).seconds * 1000;
    }
}
