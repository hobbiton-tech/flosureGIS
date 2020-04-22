import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-quote-document',
    templateUrl: './quote-document.component.html',
    styleUrls: ['./quote-document.component.scss'],
})
export class QuoteDocumentComponent implements OnInit {
    @Input()
    quoteNumber: string;

    @Input()
    dateCreated: string;

    @Input()
    clientName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    insuranceType: string;

    @Input()
    numberOfRisks: string;

    @Input()
    basicPremium: string;

    @Input()
    loadingAmount: string;

    @Input()
    discountAmount: string;

    @Input()
    totalAmount: string;

    constructor() {}

    ngOnInit(): void {}
}
