import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl
} from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { IClient } from 'src/app/clients/models/clients.model';

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
        private readonly clientsService: ClientsService
    ) {}
    // Decleration
    quoteForm: FormGroup;
    riskForm: FormGroup;
    Clients: any[];
    disabled = false;

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    listOfControl: Array<{ id: number; controlInstance: string }> = [];

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

    addField(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
        }
        const id =
            this.listOfControl.length > 0
                ? this.listOfControl[this.listOfControl.length - 1].id + 1
                : 0;

        const control = {
            id,
            controlInstance: `passenger${id}`
        };
        const index = this.listOfControl.push(control);
        console.log(this.listOfControl[this.listOfControl.length - 1]);
    }

    removeField(
        i: { id: number; controlInstance: string },
        e: MouseEvent
    ): void {
        e.preventDefault();
        if (this.listOfControl.length > 1) {
            const index = this.listOfControl.indexOf(i);
            this.listOfControl.splice(index, 1);
            console.log(this.listOfControl);
        }
    }

    ngOnInit(): void {
        this.quoteForm = this.formBuilder.group({
            quoteNumber: ['werwre', Validators.required],
            clientCode: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required]
        });

        this.clientsService.getClients().subscribe(clients => {
            this.Clients = [];
            clients.forEach(client => {
                const a = client;
                this.Clients.push(a as IClient);
            });
            console.log('<============Quote Client Data=============>');
            console.log(this.Clients);
        });

        this.addField();

        this.riskForm = this.formBuilder.group({
            riskID: ['werwre', Validators.required],
            registrationNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: ['', Validators.required],
            chasisNumber: ['', Validators.required],
            color: ['', Validators.required],
            estimatedValue: ['', Validators.required],
            productType: ['', Validators.required]
        });
    }

    ResetForm() {
        this.quoteForm.value.reset();
    }

    onSubmit() {
        const some = this.quoteForm.value;
        console.log('<============Quote Form Data=============>');
        console.log(some);
        this.quoteService.addMotorQuotation(some);
        this.ResetForm();
    }

    onAdd() {
        const risk = this.riskForm.value;
        console.log('<============Risk Form Data=============>');
        console.log(risk);
    }
}
