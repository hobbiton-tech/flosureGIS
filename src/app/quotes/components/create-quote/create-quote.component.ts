import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import { IClient } from 'src/app/clients/models/clients.model';
import { RiskModel } from '../../models/quote.model';
import { map, tap, filter, scan, retry, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-create-quote',
    templateUrl: './create-quote.component.html',
    styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {
  motor: any;
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
    quoteNumber = '';
    risks: RiskModel[];

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    listOfControl: Array<{ id: number; controlInstance: string }> = [];

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    }

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    }

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
        console.log('<=============Check=============>');

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

    // getting data from local storage
  public getFromLocalStrorage() {
    const quotes = JSON.parse(localStorage.getItem('motor'));
    return quotes;
  }

  ngOnInit(): void {
    this.quoteForm = this.formBuilder.group({
      quoteNumber: [this.quoteService.generateQuoteNumber('ran', 10)],
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


    this.motor = this.getFromLocalStrorage();
    console.log('<============Quote Number Data=============>');
    console.log(this.quoteService.generateQuoteNumber('ran', 10));

    console.log('<============Risks with Quote Number Data=============>');
    console.log(
      this.quoteService.getRisk(
        this.quoteService.generateQuoteNumber('ran', 10)
      )
    );

    this.riskForm = this.formBuilder.group({
      riskID: ['any', Validators.required],
      quoteNumber: [this.quoteService.generateQuoteNumber('ran', 10)],
      registrationNumber: ['', Validators.required],
      vehicleMake: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      engineNumber: ['', Validators.required],
      chasisNumber: ['', Validators.required],
      color: ['', Validators.required],
      estimatedValue: ['', Validators.required],
      productType: ['', Validators.required]
    });

    // get risks

    this.quoteService.getRisks().subscribe(risk => {
      this.risks = risk;
    });

    this.quoteService
      .getRisks()
      .subscribe(result => {
        this.risks = result.filter(x => x.quoteNumber === 'QOran2003230010');
        // console.log('<============Risk Data=============>');
        console.log('Risks', this.risks);
      }
      );

    }

    // ResetForm() {
    //     this.quoteForm.value.reset();
    // }


    onSubmit() {
        const some = this.quoteForm.value;
        console.log('<============Quote Form Data=============>');
        console.log(some);
        this.quoteService.addMotorQuotation(some);
        localStorage.setItem('motor', JSON.stringify(some));
        this.quoteService.getRisk('an');
        // this.ResetForm();
    }

  onAdd() {
    const risk = this.riskForm.value;
    console.log('<============Risk Form Data=============>');
    console.log(risk);
    console.log('<============Client Code Data=============>');
    this.quoteService.addRisk(risk);
    }
}
