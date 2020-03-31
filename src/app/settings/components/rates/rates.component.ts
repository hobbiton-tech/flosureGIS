import { Component, OnInit } from '@angular/core';
import { IRate } from './models/rates.model';
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


  addRateFormDrawerVisible = false;

  //search string when filtering rates
  searchString: string;


  constructor(private readonly rateService: RatesService) { }

  ngOnInit(): void {
    this.rateService.getRates().subscribe(rates => {
      this.ratesList = rates;

      this.displayRatesList = this.ratesList;
    })
  }

  openAddRateFormDrawer() {
    this.addRateFormDrawerVisible = true;
  }


  search(value: string): void {
    if (value === '' || !value) {
        this.displayRatesList = this.ratesList;
    }

    this.displayRatesList = this.ratesList.filter(rate => {
            return(rate.insuranceProduct.toLowerCase().includes(value.toLowerCase())
        || rate.premiumLevy.toString().includes(value.toString()) 
        || rate.premiumRate.toString().includes(value.toString())
        || rate.taxRate.toString().includes(value.toString()));
        
    })
}

}
