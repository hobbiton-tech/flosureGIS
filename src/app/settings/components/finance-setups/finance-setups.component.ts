import { Component, OnInit } from '@angular/core';
import { IBank} from '../../models/finance/bank.model';
import { IPaymentMethod} from '../../models/finance/payment-methodes.model';
import { IReceiptTypes } from '../../models/finance/receipt-types.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {PaymentMethodService} from 'src/app/settings/components/finance-setups/services/payment-method.service'
import {BankService} from '../../components/finance-setups/components/bank-setups/services/bank.service';
import { ReceiptTypesService } from 'src/app/settings/components/finance-setups/services/receipt-types.service';
import { v4 } from 'uuid';



@Component({
  selector: 'app-finance-setups',
  templateUrl: './finance-setups.component.html',
  styleUrls: ['./finance-setups.component.scss']
})

export class FinanceSetupsComponent implements OnInit {

  bankList: IBank[] = [];
  paymentMethodList: IPaymentMethod[] = [];
  receiptTypeList: IReceiptTypes[] = [];


  bankForm: FormGroup;
  paymentMethodForm: FormGroup;
  receiptTypeForm: FormGroup;


 
  isBankVisible = false;
  isPaymentMethodVisible = false;
  isReceiptTypeVisible= false;

  Type_name: any;
  Description: any;

  Method_name: any;
  description: any; 

  bank_name: any;
  branch_name: any;
  branch_code: any;
  swift_code: any;
  receiptType: IReceiptTypes;

  constructor(
    private BankService: BankService,
    private PaymentMethodService: PaymentMethodService,
    private ReceiptTypeService: ReceiptTypesService,
    private formBuider: FormBuilder,
  ) {
    this.bankForm = formBuider.group({
      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      branch_code: ['', Validators.required],
      swift_code: ['', Validators.required],
    });

    
    this.paymentMethodForm = formBuider.group({
      Method_name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.receiptTypeForm = formBuider.group({
      Type_name: ['', Validators.required],
      Description: ['', Validators.required],
    });
   }

  ngOnInit(): void {

///////////////////////////////
    /// BANK SERVICE //////
//////////////////////////////
    this.BankService.getBanks().subscribe((res) =>{
      this.bankList = res;
    });
///////////////////////////////////
///////// PAYMENT ////////////////////
/////////////////////////////////////////
      this.PaymentMethodService.getPaymentMethods().subscribe((res) =>{
        this.paymentMethodList = res;
      });
//////////////////////////////////
/////////// RECEIPT ///////////////
////////////////////////////////
      this.ReceiptTypeService.getReceiptTypes().subscribe((res) => {
        this.receiptTypeList = res;
      });
          }

  onChange(value) {
    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.BankService.getBanks().subscribe((res) =>{
      console.log('YEEEEEEEE>>>>', res);

      this.bankList = res;
    });

  
    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.PaymentMethodService.getPaymentMethods().subscribe((res) =>{
      console.log('YEEEEEEEE>>>>', res);

      this.paymentMethodList = res;
    });

    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.ReceiptTypeService.getReceiptTypes().subscribe((res) =>{
      this.receiptTypeList = res;
    });
  }

  onSelectBank(bank) {
    console.log('PEEEEEEEE>>>>', bank);
    this.bank_name = bank.bank_name;
    this.branch_name = bank.branch_name;
    this.branch_code = bank.branch_code;
    this.swift_code = bank.swift_code;
  }

  onSelectPaymentMethod(paymentMethod) {
    console.log('PEEEEEEEE>>>>', paymentMethod);
    this.Method_name = paymentMethod.Method_name;
    this.description = paymentMethod.description;
  }

  onSelectReceiptType(receiptType) {
    console.log('PEEEEEEEE>>>>', receiptType);
    this.Type_name = receiptType.Type_name;
    this.Description = receiptType.Description;
  }

  openBanks(): void {
    this.isBankVisible = true;
  }

  openPaymentMethods(): void {
    this.isPaymentMethodVisible = true;
  }

  openReceiptTypes(): void {
    this.isReceiptTypeVisible = true;
  }

  closeBanks(): void {
    this.isBankVisible = false;
  }

  
  closePaymentMethods(): void {
    this.isPaymentMethodVisible = false;
  }

  
  closeReceiptTypes(): void {
    this.isReceiptTypeVisible = false;
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
  

  submitPaymentMethodForm() {
    const paymentMethod: IPaymentMethod = {
      ...this.paymentMethodForm.value,
      id: v4()
    };
    this.PaymentMethodService.addPaymentMethod(paymentMethod);
    console.log('DDDDDDDDDD>>>>>>>', paymentMethod);
    this.isPaymentMethodVisible = false;
  }

  
  submitReceiptTypeForm() {
    const receiptType: IReceiptTypes = {
      ...this.receiptTypeForm.value,
      id: v4()
    };
    this.ReceiptTypeService.addReceiptType(receiptType);
    console.log('DDDDDDDDDD>>>>>>>', receiptType);
    this.isReceiptTypeVisible = false;
  }


  resetBankForm(value){}


  resetPaymentMethod(value){}

  
  resetReceiptType(value){}

}
