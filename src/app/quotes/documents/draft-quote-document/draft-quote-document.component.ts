import { Component, OnInit, Input } from '@angular/core';
import {
    MotorQuotationModel,
    RiskModel,
    Excess,
    LimitsOfLiability
} from '../../models/quote.model';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    IExccess,
    IClause
} from 'src/app/settings/models/underwriting/clause.model';
import { UserModel } from '../../../users/models/users.model';
import { UserTrackingService } from '@angular/fire/analytics';
import { UsersService } from '../../../users/services/users.service';
import { IDiscounts } from '../../models/discounts.model';
import { IExtensions } from '../../models/extensions.model';

@Component({
    selector: 'app-draft-quote-document',
    templateUrl: './draft-quote-document.component.html',
    styleUrls: ['./draft-quote-document.component.scss']
})
export class DraftQuoteDocumentComponent implements OnInit {
    user: UserModel;

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
    discounts: IDiscounts[];

    @Input()
    extensions: IExtensions[];

    @Input()
    clauses: IClause[];

    @Input()
    excessList: IExccess[];

    @Input()
    totalSumInsured: number;

    @Input()
    totalBasicPremium: number;

    @Input()
    totalLevy: number;

    @Input()
    totalNetPremium: number;

    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === this.quoteData.user)[0];
        });
    }
}
