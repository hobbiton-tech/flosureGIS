import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { IReceiptModel } from '../models/receipts.model';
import { IReceiptDTO } from 'src/app/quotes/models/receipt.dto';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jspdf from "jspdf";
// import { NgxPrinterService } from 'ngx-printer/public_api';

@Component({
    selector: 'app-view-receipts',
    templateUrl: './view-receipts.component.html',
    styleUrls: ['./view-receipts.component.scss'],
})
export class ViewReceiptsComponent implements OnInit {
    receiptsList: Policy[];
    generatingPDF = false;
    receiptsCount = 0;
    showReceiptModal = false;
    receiptedList: IReceiptModel[];
    receiptObj: IReceiptModel = new IReceiptModel();
    receipt: any;
    today = new Date();
    receiptURl: string;
    _id: string;
    loadingReceipt = false;
    key: string;
    printSrc: SafeUrl;
    newDate = new Date();

    th = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    dg = [
        'Zero',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
    ];
    tn = [
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
    ];
    tw = [
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
    ];

    constructor(
        private receiptService: AccountService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            console.log('++++++++++PARAM+++++++++');
            console.log(param);
            this._id = param.id;

            this.loadingReceipt = true;

            setTimeout(() => {
                this.loadingReceipt = false;
            }, 3000);

            this.receiptService.getReciept(this._id).subscribe((receipts) => {
                console.log("NEW Receipt", receipts);
                this.receipt = receipts.data
                console.log("NEW Receipt Data", receipts.data);
            });

            // this.generateDocuments();
        });
    }

    htmlToPdf() {
        this.generatingPDF = true;
        const data = document.getElementById('printSection');
        html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jspdf('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save( `${this.receipt.receipt_number}-Account-Statement.pdf`);
        this.generatingPDF = false;
      });
    }



    toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) {
            return 'not a number';
        }
        let x = s.indexOf('.');
        if (x == -1) {
            x = s.length;
        }
        if (x > 15) {
            return 'too big';
        }
        const n = s.split('');
        let str = '';
        let sk = 0;
        for (let i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += this.tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] != 0) {
                    str += this.tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] != 0) {
                str += this.dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) {
                    str += 'Hundred ';
                }
                sk = 1;
            }

            if ((x - i) % 3 == 1) {
                if (sk) {
                    str += this.th[(x - i - 1) / 3] + ' ';
                }
                sk = 0;
            }
        }
        if (x != s.length) {
            const y = s.length;
            str += 'point ';
            for (let i = x + 1; i < y; i++) {
                str += this.dg[n[i]] + ' ';
            }
        }
        return str.replace(/\s+/g, ' ');
    }

    print() {}
}
