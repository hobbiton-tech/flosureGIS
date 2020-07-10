import { Component, OnInit, Input } from '@angular/core';
import { MotorQuotationModel, RiskModel, Excess, LimitsOfLiability } from '../../models/quote.model';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-draft-quote-document',
    templateUrl: './draft-quote-document.component.html',
    styleUrls: ['./draft-quote-document.component.scss']
})
export class DraftQuoteDocumentComponent implements OnInit {
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
    premiumLevy: string;

    @Input()
    totalAmount: string;

    @Input()
    quoteData: MotorQuotationModel;

    @Input()
    risks: RiskModel[];

    @Input()
    limitsOfLiabilities: LimitsOfLiability[];

    @Input()
    excessList: Excess[];

    @Input()
    totalSumInsured: number;

    @Input()
    totalBasicPremium: number;

    @Input()
    totalLevy: number;

    @Input()
    totalNetPremium: number;

    constructor() {}

    ngOnInit(): void {}
}
