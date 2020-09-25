import { Risks } from './../../../reports/model/quotation.model';
import {
    LimitsOfLiability,
    LiabilityType,
    Excess
} from './../../../quotes/models/quote.model';
import { Component, OnInit, Input } from '@angular/core';
import { RiskModel } from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    ICorporateClient,
    IIndividualClient
} from 'src/app/clients/models/clients.model';
import moment from 'moment';
import { CoverNote } from '../models/documents.model';
import { IExccess, IClause } from 'src/app/settings/models/underwriting/clause.model';
import { UsersService } from '../../../users/services/users.service';
import { UserModel } from '../../../users/models/users.model';
import { IExtensions } from 'src/app/quotes/models/extensions.model';

@Component({
    selector: 'app-policy-schedule-document',
    templateUrl: './policy-schedule-document.component.html',
    styleUrls: ['./policy-schedule-document.component.scss']
})
export class PolicyScheduleDocumentComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    clientNumber: string;

    @Input()
    coverNot: CoverNote;

    @Input()
    clientEmail: string;

    @Input()
    policyRisk: RiskModel;

    @Input()
    limitsOfLiablity: LimitsOfLiability[];

    @Input()
    issueDate: string;

    @Input()
    issueTime: string;

    @Input()
    policyNumber: string;

    @Input()
    policy: Policy;

    @Input()
    basicPremium: string;

    @Input()
    loadingAmount: string;

    @Input()
    discountAmount: string;

    @Input()
    totalAmount: string;

    @Input()
    coverFrom: string;

    @Input()
    coverTo: string;

    @Input()
    premiumLevy: string;

    @Input()
    client: IIndividualClient & ICorporateClient;

    @Input()
    deathAndInjuryPerPerson: number;

    @Input()
    deathAndInjuryPerEvent: number;

    @Input()
    propertyDamage: number;

    @Input()
    combinedLimits: number;

    @Input()
    below21Years: number;

    @Input()
    over70Years: number;

    @Input()
    noLicence: number;

    @Input()
    excessList: IExccess[];

    @Input()
    extensions: IExtensions[];

    @Input()
    clauses: IClause[];

    @Input()
    careLessDriving: number;

    @Input()
    otherEndorsement: number;

    todayDate: Date;

    yearOfManufacture: string;
    agent: UserModel;

    constructor(private usersService: UsersService) {}

    generatingPDF = false;

    comb: LimitsOfLiability;
    limits: LimitsOfLiability;

    deathPE: LimitsOfLiability;

    deathPP: LimitsOfLiability;
    propertyD: LimitsOfLiability;

    ngOnInit(): void {

      this.usersService.getUsers().subscribe((users) => {
        this.agent = users.find((x) => x.ID === this.policy.user);
      });
        this.todayDate = new Date();
        this.getLimit();
    }

    getLimit() {
        for (const lim of this.limitsOfLiablity) {
            this.limits = lim;
            if (lim.liabilityType === 'combinedLimits') {
                this.comb = lim;
            }

            if (lim.liabilityType === 'deathAndInjuryPerEvent') {
                this.deathPE = lim;
            }

            if (lim.liabilityType === 'deathAndInjuryPerPerson') {
                this.deathPP = lim;
            }

            if (lim.liabilityType === 'propertyDamage') {
                this.propertyD = lim;
            }
        }
    }

    getYearOfManufacture(risk: RiskModel) {
        const year: string = moment(risk.vehicle.yearOfManufacture)
            .year()
            .toString();
        return year;
    }

    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('debitPrintSection');
        const options = {
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth
        };

        html2canvas(div, options).then(canvas => {
            const doc = new jsPDF({
                unit: 'mm',
                format: 'a3'
            });
            const imgData = canvas.toDataURL('image/PNG');
            doc.addImage(imgData, 'PNG', 0, 0, 297, 420);

            const pdfOutput = doc.output();
            const buffer = new ArrayBuffer(pdfOutput.length);
            const array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }
            const fileName = `${this.policy.policyNumber}-motor-schedule.pdf`;
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }
}
