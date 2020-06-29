import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    RiskModel,
    ITimestamp,
    DiscountModel,
    Excess,
    LimitsOfLiability,
} from 'src/app/quotes/models/quote.model';
import { Policy } from '../../models/policy.model';
import moment from 'moment';
import { IReceiptModel } from 'src/app/accounts/components/models/receipts.model';
import { CoverNote } from '../models/documents.model';

@Component({
    selector: 'app-policy-comprehensive-certificate',
    templateUrl: './policy-comprehensive-certificate.component.html',
    styleUrls: ['./policy-comprehensive-certificate.component.scss'],
})
export class PolicyComprehensiveCertificateComponent implements OnInit {
    @Input()
    clientName: string;

    @Input()
    insuredName: string;

    @Input()
    clientNumber: string;

    @Input()
    clientEmail: string;

    @Input()
    clientAddress: string;

    @Input()
    excessListCert: Excess[]=[];

    @Input()
    limitsOfLiablityCert: LimitsOfLiability[]=[];

    @Input()
    cndAmount = 0;

    @Input()
    basicPremium: string;

    @Input()
    receipt: IReceiptModel;

    @Input()
    loadingAmount: string;

    @Input()
    discountAmount: string;

    @Input()
    totalAmount: string;

    @Input()
    premiumLevy: string;

    @Input()
    policyRisk: RiskModel;

    @Input()
    issueDate: string;

    @Input()
    issueTime: string;

    @Input()
    combInfo:string;
    @Input()
    combAmount:number;
    @Input()
    proDInfo:string;
    @Input()
    propDAmount:number;
    @Input()
    deathPEInfo:string;
    @Input()
    deathPEAmount:number;
    @Input()
    deathPPInfo:string;
    @Input()
    deathPPAmount:number;

    @Input()
    fExcexxType:string;
    @Input()
    fExcessAmount:number;
    @Input()
    sExcessType:string;
    @Input()
    sExcessAmount:number;
    @Input()
    tExcessType:string;
    @Input()
    tExcessAmount:number;

    @Input()
    policyNumber: string;

    @Input()
    policy: Policy;
    @Input()
    coverNot: CoverNote;

    subTotal: number;

    generatingPDF = false;
    dateOfIssue = new Date();
    limits: LimitsOfLiability;
    comb: LimitsOfLiability;
    deathPE: LimitsOfLiability;
    deathPP: LimitsOfLiability;
    propertyD: LimitsOfLiability;
    firstExcess: Excess;
    secondExcess: Excess;
    thirdExcess: Excess;
    co = false;
    pe = false;
    pp = false;
    pd = false;
    tppd: boolean;


    constructor() {}

    ngOnInit(): void {
        this.getLimit()
        this.getExcessess()
    }

    getExcessess() {

        this.tppd = true;

        for( const ex of this.excessListCert) {
            
            if (ex.excessType ==='Third Party Property Damage (TPPD ) 10% Minimum') {

                this.firstExcess = ex;
                console.log("TTTTTTT<<<", this.firstExcess);
                
            }
            if (ex.excessType ==='Own Damage 10% Minimum') {
                this.secondExcess = ex;
                console.log("TTTTTTT<<<", this.secondExcess);
            }
            if (ex.excessType ==='Theft Excess [15%] Minimum') {
                this.thirdExcess = ex;
                console.log("TTTTTTT<<<", this.thirdExcess);
            }
        }
    }

    getLimit() {
        for(const lim of this.limitsOfLiablityCert) {
            
            this.limits = lim
            if( lim.liabilityType === 'combinedLimits') {
                this.co = true;
                // this.pd = true;
                // this.pe = true;
                // this.pp = true;
                this.comb = lim
            }

            if( lim.liabilityType === 'deathAndInjuryPerEvent') {
                this.deathPE = lim
                this.co = true;
                this.pd = false;
                this.pe = false;
                this.pp = false;
            }

            if( lim.liabilityType === 'deathAndInjuryPerPerson') {
                this.deathPP = lim
                this.co = true;
                this.pd = false;
                this.pe = false;
                this.pp = false;
            }

            if( lim.liabilityType === 'propertyDamage') {
                this.propertyD = lim
                this.co = true;
                this.pd = false;
                this.pe = false;
                this.pp = false;
            }
        }
    }

    getYearOfManufacture(risk: RiskModel) {
        let year: string = moment(risk.yearOfManufacture).year().toString();
        return year;
    }
    htmlToPdf() {
        this.generatingPDF = true;
        const div = document.getElementById('printSection');
        // const options = {
        //     scale: 1.32,
        //     allowTaint: true,
        //     onclone: (doc) => {
        //         doc.querySelector('div').style.transform = 'none';
        //     },
        // };
        const options = {
            scale: 1.32,
            allowTaint: true,
            onclone: (doc) => {
                doc.querySelector('div').style.transform = 'none';
            },
            background: 'white',
            height: div.clientHeight,
            width: div.clientWidth,
        };

        html2canvas(div, options).then((canvas) => {
            //Initialize JSPDF
            let doc = new jsPDF({
                unit: 'px',
                format: 'a4',
            });
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
            const fileName = 'policy-certificate.pdf';

            // Make file
            doc.save(fileName);
            this.generatingPDF = false;
        });
    }

    convertRiskDate(risk: RiskModel): number {
        return (risk.riskStartDate as ITimestamp).seconds * 1000;
    }

    sumArray(items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}
