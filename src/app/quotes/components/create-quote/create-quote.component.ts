import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service';
import { Router } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    ICorporateClient,
    IIndividualClient
} from 'src/app/clients/models/clients.model';
import {
    RiskModel,
    Quote,
    MotorQuotationModel
} from '../../models/quote.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-create-quote',
    templateUrl: './create-quote.component.html',
    styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private stepperService: StepperService,
        private readonly router: Router,
        private readonly quoteService: QuotesService,
        private readonly clientsService: ClientsService,
        private message: NzMessageService
    ) {}
    validateRiskThirdPartyForm: FormGroup;
    motor: any;
    // Decleration
    quoteForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;
    disabled = false;
    quoteNumber = '';
    risks: RiskModel[] = [];

    optionList = [
        { label: 'Motor Comprehensive', value: 'Comprehensive' },
        { label: 'Motor Third Party', value: 'ThirdParty' }
    ];
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    listOfControl: Array<{ id: number; controlInstance: string }> = [];

    submitForm(): void {
        for (const i in this.validateRiskThirdPartyForm.controls) {
            this.validateRiskThirdPartyForm.controls[i].markAsDirty();
            this.validateRiskThirdPartyForm.controls[
                i
            ].updateValueAndValidity();
        }
    }

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        console.log(value);
    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    };

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    };

    handleStartOpenChange(open: boolean): void {
        if (!open) {
            this.endOpen = true;
        }
        console.log('handleStartOpenChange', open, this.endOpen);
    }

    handleEndOpenChange(open: boolean): void {
        console.log(open);
        this.endOpen = open;
    }

    ngOnInit(): void {
        this.quoteForm = this.formBuilder.group({
            quoteNumber: [this.quoteService.generateQuoteNumber('ran', 10)],
            clientCode: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            town: ['', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            status: ['Draft']
        });

        this.clientsService.getAllClients().subscribe(clients => {
            this.clients = [...clients[0], ...clients[1]] as Array<
                IIndividualClient & ICorporateClient
            >;

            console.log('============All Clients=========');
            console.log(this.clients);
        });

        // Comprehensive Form
        this.riskComprehensiveForm = this.formBuilder.group({
            regNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            color: ['', Validators.required],
            estimatedValue: ['', Validators.required],
            productType: ['', Validators.required],
            insuranceType: ['Comprehensive']
        });

        // Third Party Form
        this.riskThirdPartyForm = this.formBuilder.group({
            regNumber: ['', [Validators.required]],
            vehicleMake: ['', [Validators.required]],
            vehicleModel: ['', [Validators.required]],
            engineNumber: ['', [Validators.required]],
            chassisNumber: ['', [Validators.required]],
            color: ['', [Validators.required]],
            productType: ['', [Validators.required]],
            insuranceType: ['ThirdParty']
        });
    }

    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push(this.riskThirdPartyForm.value);
        this.risks = [...this.risks, ...some];
        console.log(this.risks);
    }

    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push(this.riskComprehensiveForm.value);
        this.risks = [...this.risks, ...some];
        console.log(this.risks);
    }

    addQuote(): void {
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            risks: this.risks
        };
        console.log('=======Full Quotation=======');
        console.log(quote);
        this.quoteService
            .addMotorQuotation(quote)
            .then(success => {
                this.message.success('Quotation Successfully created');
            })
            .catch(err => {
                this.message.error('Quotation Creation Failed');
            });
    }
}
