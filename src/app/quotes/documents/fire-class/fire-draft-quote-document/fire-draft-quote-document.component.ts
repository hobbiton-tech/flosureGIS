import { Component, OnInit, Input } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    LimitsOfLiability,
    Excess
} from 'src/app/quotes/models/quote.model';
import {
    IExccess,
    IClause
} from 'src/app/settings/models/underwriting/clause.model';
import { IDiscounts } from 'src/app/quotes/models/discounts.model';
import { IExtensions } from 'src/app/quotes/models/extensions.model';

@Component({
    selector: 'app-fire-draft-quote-document',
    templateUrl: './fire-draft-quote-document.component.html',
    styleUrls: ['./fire-draft-quote-document.component.scss']
})
export class FireDraftQuoteDocumentComponent implements OnInit {
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
    excessList: IExccess[];

    @Input()
    discounts: IDiscounts[];

    @Input()
    extensions: IExtensions[];

    @Input()
    clauses: IClause[];

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
