import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-policy-clauses-document',
    templateUrl: './policy-clauses-document.component.html',
    styleUrls: ['./policy-clauses-document.component.scss'],
})
export class PolicyClausesDocumentComponent implements OnInit {
    @Output()
    generatePDF = new EventEmitter();

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
            //Initialize JSPDF
            let doc = new jsPDF('p', 'mm', 'a4');
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
            const fileName = 'policy-clauses.pdf';

            // Make file
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }
}
