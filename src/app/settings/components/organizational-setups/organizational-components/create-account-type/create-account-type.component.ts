import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-account-type',
  templateUrl: './create-account-type.component.html',
  styleUrls: ['./create-account-type.component.scss']
})
export class CreateAccountTypeComponent implements OnInit {

  createAccountTypeForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeAccountTypeDrawer: EventEmitter<any> = new EventEmitter(); 


  constructor(private _formBuilder: FormBuilder) {
    this.createAccountTypeForm = this._formBuilder.group({
      type: '',
      short_description: '',
      account_type: '',
      commission_rate: '',
      vat_rate: '',
      withholding_tax_rate: ''
    })
   }

  ngOnInit(): void {
  }


  closeDrawer(): void {
    this.closeAccountTypeDrawer.emit();
  }

}
