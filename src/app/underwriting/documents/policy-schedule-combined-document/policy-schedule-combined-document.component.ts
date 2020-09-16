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

@Component({
    selector: 'app-policy-schedule-combined-document',
    templateUrl: './policy-schedule-combined-document.component.html',
    styleUrls: ['./policy-schedule-combined-document.component.scss']
})
export class PolicyScheduleCombinedDocumentComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    policyRisk: RiskModel;

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
    collisionAndFire: number;

    @Input()
    theftOfVehicleWithAntiTheftDevice: number;

    @Input()
    theftOfVehicleWithoutAntiTheftDevice: number;

    @Input()
    thirdPartyPropertyDamage: number;

    todayDate: Date;

    yearOfManufacture: string;

    constructor() {}

    generatingPDF = false;

    ngOnInit(): void {
        this.todayDate = new Date();
    }

    getYearOfManufacture(risk: RiskModel) {
        let year: string = moment(risk.vehicle.yearOfManufacture)
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
            let doc = new jsPDF({
                unit: 'mm',
                format: 'a3'
            });
            let imgData = canvas.toDataURL('image/PNG');
            doc.addImage(imgData, 'PNG', 0, 0, 297, 420);

            let pdfOutput = doc.output();
            let buffer = new ArrayBuffer(pdfOutput.length);
            let array = new Uint8Array(buffer);
            for (let i = 0; i < pdfOutput.length; i++) {
                array[i] = pdfOutput.charCodeAt(i);
            }
            const fileName = `${this.policy.policyNumber}-motor-schedule.pdf`;
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }
}
