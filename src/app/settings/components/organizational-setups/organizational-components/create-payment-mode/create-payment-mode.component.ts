import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-payment-mode',
  templateUrl: './create-payment-mode.component.html',
  styleUrls: ['./create-payment-mode.component.scss']
})
export class CreatePaymentModeComponent implements OnInit {

  createPaymentModeForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closePaymentModeDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) { 
    this.createPaymentModeForm = this._formBuilder.group({
      short_description: '',
      min_amount: '',
      max_amount: ''
    })
  }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closePaymentModeDrawer.emit();
  }

}
