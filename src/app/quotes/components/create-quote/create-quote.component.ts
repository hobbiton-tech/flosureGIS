import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepperService } from 'src/app/quotes/services/stepper.service'
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-quote',
  templateUrl: './create-quote.component.html',
  styleUrls: ['./create-quote.component.scss']
})
export class CreateQuoteComponent implements OnInit {

  /* showStepper: boolean;
  current: number;

  stepperSubcription: Subscription;
  indexSubscription: Subscription;
  
  quotationDetailsStepper() {
    this.stepperService.changeIndex(1);
    this.router.navigateByUrl('create-quote/quotation-details')
  } */

  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

 
  constructor( 
    private _formBuilder: FormBuilder, private stepperService: StepperService, private readonly router: Router
  ) { 
    
  }

  ngOnInit(): void {
    /* this.stepperService.toggleStepper(true);
    this.stepperService.changeIndex(0);

    this.stepperSubcription = this.stepperService.showStepper$.subscribe(val => {
      this.showStepper = val
    })

    this.indexSubscription = this.stepperService.currentStep$.subscribe(index => {
      this.current = index;
    }) */
    
  }

}
