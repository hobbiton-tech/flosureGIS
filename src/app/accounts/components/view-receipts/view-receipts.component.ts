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
    receipt: IReceiptModel;
    today = new Date();
    receiptURl: string;
    _id: string;
    loadingReceipt = false;
    key: string;
    printSrc: SafeUrl;
    newDate = new Date();

    th = ['', 'thousand', 'million', 'billion', 'trillion'];
    dg = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
    ];
    tn = [
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ];
    tw = [
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
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

            this.receiptService.getReciepts().subscribe((receipts) => {
                this.receipt = receipts.filter((x) => x.id === param.id)[0];
            });

            // this.generateDocuments();
        });
    }

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('printSection');
        const options = {
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
            const fileName = 'receipt.pdf';

            // Make file
            doc.save(fileName);
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
        let n = s.split('');
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
                    str += 'hundred ';
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
            let y = s.length;
            str += 'point ';
            for (let i = x + 1; i < y; i++) {
                str += this.dg[n[i]] + ' ';
            }
        }
        return str.replace(/\s+/g, ' ');
    }
    // generateDocuments(): void {
    //     this.receiptService.getReciepts().subscribe((receipts) => {
    //         this.receiptObj = receipts.filter((x) => x.id === this._id)[0];
    //         this.receiptedList = receipts;
    //         this.receipt = this.receiptedList.filter(
    //             (x) => x.id === this._id
    //         )[0];

    //         const receipt: IReceiptDTO = {
    //             recieptNumber: this.receipt.receiptNumber,
    //             tPin: this.receipt.tpinNumber,
    //             recievedFrom: this.receipt.receivedFrom,
    //             onBehalfOf: this.receipt.onBehalfOf,
    //             address: 'this.receipt.address',
    //             sumInWords: 'sum in words',
    //             agentID: this.receipt.capturedBy,
    //             paymentMethod: this.receipt.paymentMethod,
    //             paymentRef: this.receipt.receiptNumber,
    //             policyNumber: this.receipt.policyNumber,
    //             remarks: this.receipt.receiptType,
    //             todayDate: this.receipt.todayDate,
    //             time: this.receipt.receiptNumber,
    //             narration: this.receipt.narration,
    //             accountNumber: 'this.receipt.address',
    //             dateRecieved: this.receipt.todayDate,
    //             sumInDigits: Number(this.receipt.sumInDigits.toFixed(2)),
    //             capturedBy: this.receipt.receiptNumber,
    //         };

    //         this.receiptService.generateReceipt(receipt).subscribe((data) => {
    //             this.receiptURl = data.Location;
    //             this.key = data.Key;
    //             console.log('++++++++RECEIPT DATA++++++++');
    //             console.log(data);
    //         });

    //         console.log(this.receipt);
    //     });
    //     // console.log(this.isReceiptApproved);
    // }

    // download() {
    //     console.log('...........PDF URL..............');

    //     console.log(this.receiptURl);

    //     this.receiptService.getPDF(this.receiptURl).subscribe((x) => {
    //         const newBlob = new Blob([x], { type: 'application/pdf' });
    //         if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //             window.navigator.msSaveOrOpenBlob(newBlob);
    //             return;
    //         }
    //         const data = window.URL.createObjectURL(newBlob);

    //         const link = document.createElement('a');
    //         link.href = data;
    //         link.download = this.key;
    //         link.dispatchEvent(
    //             new MouseEvent('click', {
    //                 bubbles: true,
    //                 cancelable: true,
    //                 view: window,
    //             })
    //         );

    //         setTimeout(function () {
    //             window.URL.revokeObjectURL(data);
    //             link.remove();
    //         }, 100);
    //     });
    // }

    print() {}
}
