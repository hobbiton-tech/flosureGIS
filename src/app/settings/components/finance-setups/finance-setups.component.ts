import { Component, OnInit } from '@angular/core';
import { IBank} from '../../models/finance/bank.model';
import { IPaymentMethod} from '../../models/finance/payment-methodes.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {BankService} from '../../components/finance-setups/components/bank-setups/services/bank.service';
import { v4 } from 'uuid';

@Component({
  selector: 'app-finance-setups',
  templateUrl: './finance-setups.component.html',
  styleUrls: ['./finance-setups.component.scss']
})
export class FinanceSetupsComponent implements OnInit {

  bankList: IBank[] = [];
  paymentMethodList: IPaymentMethod[] = [];

  
  bankForm: FormGroup;
  paymentMethodForm: FormGroup;

  isBankVisible = false;
  isPaymentMethodVisible = false;

  Method_name: any;
  description: any; 

  bank_name: any;
  branch_name: any;
  branch_code: any;
  swift_code: any;

  constructor(
    private BankService: BankService,
    private formBuider: FormBuilder,
  ) {
    this.bankForm = formBuider.group({
      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      branch_code: ['', Validators.required],
      swift_code: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.BankService.getBanks().subscribe((res) =>{
      this.bankList = res;
    });

    // this.BankService.getBanks().subscribe((res) => {
    //   console.log('YEEEEEEEE>>>>', res)
    // });
  }

  onChange(value) {
    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.BankService.getBanks().subscribe((res) =>{
      console.log('YEEEEEEEE>>>>', res);

      this.bankList = res;
    });
  }

  onSelectBank(bank) {
    console.log('PEEEEEEEE>>>>', bank);
    this.bank_name = bank.bank_name;
    this.branch_name = bank.branch_name;
    this.branch_code = bank.branch_code;
    this.swift_code = bank.swift_code;
  }

  openBanks(): void {
    this.isBankVisible = true;
  }

  closeBanks(): void {
    this.isBankVisible = false;
  }

  submitBankForm() {
    const bank: IBank = {
      ...this.bankForm.value,
      id: v4()
    };
    this.BankService.addBank(bank);
    console.log('DDDDDDDDDD>>>>>>>', bank);
    this.isBankVisible = false;
  }
  resetBankForm(value){}


}
