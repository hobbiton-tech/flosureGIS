import { Component, OnInit } from '@angular/core';
import { IRate, ITax } from './models/rates.model';
import { RatesService } from './services/rates.service';
import 'firebase/storage';
import 'firebase/firestore';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {
  ratesList: IRate[];
  displayRatesList: IRate[];

  taxList: ITax[];
  displayTaxList: ITax[];


  addRateFormDrawerVisible = false;

  addTaxFormDrawerVisible = false;

  //search string when filtering rates
  ratesSearchString: string;

  //search string when filtering taxes
  taxesSearchString: string;


  constructor(private readonly rateService: RatesService) { }

  ngOnInit(): void {

    //get rates and populate rates List
    this.rateService.getRates().subscribe(rates => {
      this.ratesList = rates;
      this.displayRatesList = this.ratesList;
    })

    //get taxes and populate tax List
    this.rateService.getTaxes().subscribe(taxes => {
      this.taxList = taxes;
      this.displayTaxList = this.taxList;
    })
  }

  openAddRateFormDrawer() {
    this.addRateFormDrawerVisible = true;
  }

  openAddTaxFormDrawer() {
    this.addTaxFormDrawerVisible = true;
  }


  searchRates(value: string): void {
    if (value === '' || !value) {
        this.displayRatesList = this.ratesList;
    }

    this.displayRatesList = this.ratesList.filter(rate => {
            return(rate.insuranceProduct.toLowerCase().includes(value.toLowerCase())
        || rate.premiumLevy.toString().includes(value.toString()) 
        || rate.premiumRate.toString().includes(value.toString())
        || rate.maxLimit.toString().includes(value.toString())
        || rate.minLimit.toString().includes(value.toString()));
        
    })
}

searchTaxes(value: string): void {
  if (value === '' || !value) {
      this.displayTaxList = this.taxList;
  }

  this.displayTaxList = this.taxList.filter(tax => {
          return(tax.shortName.toLowerCase().includes(value.toLowerCase()));
      
  })
}

}
