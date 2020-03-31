import { Component, OnInit } from '@angular/core';
import { Quote, MotorQuotationModel, RiskModel } from '../../models/quote.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Policy } from 'src/app/underwriting/models/policy.model';
import { PoliciesService } from 'src/app/underwriting/services/policies.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';

@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {
  //form
  quoteDetailsForm: FormGroup;

  //quotesLists 
  quotesList: MotorQuotationModel[];
  risks: RiskModel[] = [];

  quoteData: MotorQuotationModel = new MotorQuotationModel();

  //quoteNumber
  quoteNumber: string;
  quote: MotorQuotationModel;
  displayQuote: MotorQuotationModel;

  selectedQuote:Quote;
  isEditmode = false;

  //modal
  isVisible = false;
  isConfirmLoading = false;

  searchString: string;

  constructor(
     private formBuilder: FormBuilder,
     private policiesService: PoliciesService,
     private router: Router,
     private quotesService: QuotesService,
     private route: ActivatedRoute,
     ) { }

  ngOnInit(): void {
    // this.quotesService.getQuotes().subscribe(quotes => {
    //   this.quoteData = quotes.filter(x => x.quoteNumber === this.quoteNumber)[0];
    //   this.quotesList = quotes;
    //   console.log(this.quotesList);
    //   console.log(this.quoteData);
    // })

    //get Quote number from parameters
    this.route.params.subscribe(param => {
      this.quoteNumber = param.quoteNumber;
      this.quotesService.getQuotes().subscribe(quotes => {
        this.quoteData = quotes.filter(x => x.quoteNumber === this.quoteNumber)[0];
        this.quotesList = quotes;
        this.quote = this.quotesList.filter(x => x.quoteNumber === this.quoteNumber)[0];
        this.displayQuote = this.quote;
      })
    })

    

    this.quoteDetailsForm = this.formBuilder.group({
      client: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      currency: ['', Validators.required],
      productType: ['', Validators.required],
      quater: ['', Validators.required],
      town: ['', Validators.required],
      preparedBy: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      sumInsured: ['', Validators.required]
    })

    //set values of fields in policy details form
    this.quotesService.getQuotes().subscribe(quotes => {
      this.quoteData = quotes.filter(x => x.quoteNumber === this.quoteNumber)[0];
      this.quoteDetailsForm.get('client').setValue(this.quoteData.clientCode);
      this.quoteDetailsForm.get('currency').setValue(this.quoteData.currency);
      this.quoteDetailsForm.get('startDate').setValue(this.quoteData.startDate);
      this.quoteDetailsForm.get('endDate').setValue(this.quoteData.endDate);
      this.quoteDetailsForm.get('town').setValue(this.quoteData.town);
    })
  }

  handlePayment() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
       //route to policy details
       this.router.navigateByUrl('/flosure/underwriting/policies');
    }, 3000);

    console.log(this.quoteDetailsForm.value);
    //push to convert quote to policy and policies collection
    const policy: Policy = {
      ...this.quoteDetailsForm.value,
      risks: this.quoteData.risks
    };
    this.policiesService.addPolicy(policy);

   
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  //filter by search
  search(value: string): void {
    if (value === '' || !value) {
        this.displayQuote = this.quote;
    }

    this.displayQuote.risks = this.quote.risks.filter(quote => {   
            return (quote.insuranceType.toLowerCase().includes(value.toLowerCase())
        || quote.regNumber.toLowerCase().includes(value.toLowerCase()) 
        || quote.chassisNumber.toLowerCase().includes(value.toLowerCase())
        || quote.vehicleMake.toLowerCase().includes(value.toLowerCase())
        || quote.vehicleModel.toLowerCase().includes(value.toLowerCase())
        || quote.engineNumber.toLowerCase().includes(value.toLowerCase())
        || quote.productType.toLowerCase().includes(value.toLowerCase())
        || quote.color.toLowerCase().includes(value.toLowerCase()));
    });
}

}
