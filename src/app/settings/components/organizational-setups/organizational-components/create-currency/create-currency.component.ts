import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-currency',
  templateUrl: './create-currency.component.html',
  styleUrls: ['./create-currency.component.scss']
})
export class CreateCurrencyComponent implements OnInit {

  createCurrencyForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeCurrencyDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {
    this.createCurrencyForm = this._formBuilder.group({
      name: '',
      symbol: ''
    })
   }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closeCurrencyDrawer.emit();
  }

}
