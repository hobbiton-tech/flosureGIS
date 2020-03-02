import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  createAccountForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeAccountDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {
    this.createAccountForm = this._formBuilder.group({
      account_id: '',
      account_name: '',
      email: '',
      phone: '',
      pin_number: '',
      bank: '',
      bank_branch: '',
      payment_mode: '',
      contact_title: '',
      account_short_description: '',
      status: ''
    })

   }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closeAccountDrawer.emit();
  }

}
