import { Component, OnInit, } from '@angular/core';


@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.scss']
})
export class CommissionPaymentComponent implements OnInit {


  typeOfClient = ['Agent', 'Broker', 'Sales Representatives'];
  selectedIntermediary = 'Agent';




  constructor() { }

  ngOnInit(): void {
  }


  onBack(): void {
    console.log('onBack');
  }

  selectInt(value) {
    this.selectedIntermediary = value;
  }

//   showModal(): void {
//     this.isVisible = true;
// }

}
