import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-policy-debit-note-document',
    templateUrl: './policy-debit-note-document.component.html',
    styleUrls: ['./policy-debit-note-document.component.scss'],
})
export class PolicyDebitNoteDocumentComponent implements OnInit {
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

    constructor() {}

    ngOnInit(): void {}
}
