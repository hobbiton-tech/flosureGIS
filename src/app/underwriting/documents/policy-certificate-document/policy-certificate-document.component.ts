import { Component, OnInit, Input } from '@angular/core';
import { RiskModel } from '../../models/policy.model';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as canvg from 'canvg';

@Component({
    selector: 'app-policy-certificate-document',
    templateUrl: './policy-certificate-document.component.html',
    styleUrls: ['./policy-certificate-document.component.scss'],
})
export class PolicyCertificateDocumentComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    clientNumber: string;

    @Input()
    policyRisk: RiskModel;

    @Input()
    issueDate: string;

    @Input()
    issueTime: string;

    generatingPDF = false;

    constructor() {}

    ngOnInit(): void {}

    gotToPrint(): void {

    }

    convertToPDF(): void {
        let svg = document.getElementById('certificate');
        // svg = svg.replace(/\r?\n|\r/g, '').trim();
        let canvas = document.createElement('canvas');
        // let some = canvg.Canvg.from(canvas.getContext('2d'), svg);
        let imageData = canvas.toDataURL('image/png');
        let doc = new jsPDF();
        doc.addImage(imageData, 'PNG', 0, 0)
        doc.save('cerficate');
    }

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('printSection');
        const options = {
            // background: 'white',
            // height: div.clientHeight,
            width: 572,
            height: 865,
            // width: div.clientWidth,
        };

        html2canvas(div, options).then((canvas) => {
            //Initialize JSPDF
            let doc = new jsPDF('p', 'pt', 'a4');
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
}
