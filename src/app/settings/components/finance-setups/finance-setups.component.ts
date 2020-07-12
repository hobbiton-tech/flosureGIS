import { Component, OnInit } from '@angular/core';
import { IBank} from '../../models/finance/bank.model';
import { IBranch} from '../../models/finance/branch.model';
import { IPaymentMethod} from '../../models/finance/payment-methodes.model';
import { IReceiptTypes } from '../../models/finance/receipt-types.model';
import { IDiscountType} from '../../models/finance/discount-type.model'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {PaymentMethodService} from 'src/app/settings/components/finance-setups/services/payment-method.service'
import {BankService} from '../../components/finance-setups/components/bank-setups/services/bank.service';
import {BranchService} from '../../components/finance-setups/services/branch.service';
import { ReceiptTypesService } from 'src/app/settings/components/finance-setups/services/receipt-types.service';
import { DiscountTypesService } from 'src/app/settings/components/finance-setups/services/discount-types.service';
import { v4 } from 'uuid';
import { from } from 'rxjs';
 

@Component({
  selector: 'app-finance-setups',
  templateUrl: './finance-setups.component.html',
  styleUrls: ['./finance-setups.component.scss']
})

export class FinanceSetupsComponent implements OnInit {

  i = 0;
  branchId: string | null = null;

  starBranch(id: string): void {
    this.branchId = id;
  }

  stopBranch(): void {
    this.branchId = null;
  }


  deleteRow(id: string): void {
    this.bankList = this.bankList.filter(d => d.id !== id);
  }


  bankList: IBank[] = [];
  banks: IBank[] = [];
  branchList: IBranch[] = [];
  paymentMethodList: IPaymentMethod[] = [];
  receiptTypeList: IReceiptTypes[] = [];
  discountTypeList: IDiscountType[] = [];



  bankForm: FormGroup;
  branchForm: FormGroup;
  paymentMethodForm: FormGroup;
  receiptTypeForm: FormGroup;
  discountTypeForm: FormGroup;

 
  isBankVisible = false;
  isBranchVisible = false;
  isPaymentMethodVisible = false;
  isReceiptTypeVisible = false;
  isDiscountTypeVisible = false;

  branch_Code: any;


  dtype: any;
  ddescription;

  Type_name: any;
  Description: any;

  Method_name: any;
  description: any; 

  bank_name: any;
  branch_name: any;
  branch_code: any;
  swift_code: any;
  receiptType: IReceiptTypes;
  selectedBankId: string;

  constructor(
    private BankService: BankService,
    private PaymentMethodService: PaymentMethodService,
    private ReceiptTypeService: ReceiptTypesService,
    private DiscountTypesService: DiscountTypesService,
    private BranchService: BranchService,
    private formBuider: FormBuilder,
  ) {
    this.bankForm = formBuider.group({
      bank_name: ['', Validators.required],
      swift_code: ['', Validators.required],
      description: ['',Validators.required],
    });

    this.branchForm = formBuider.group({
      branch_name: ['', Validators.required],
      branch_code: ['', Validators.required],
      description: ['', Validators.required],
    });

    
    this.paymentMethodForm = formBuider.group({
      Method_name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.receiptTypeForm = formBuider.group({
      Type_name: ['', Validators.required],
      Description: ['', Validators.required],
    });

    this.discountTypeForm = formBuider.group({
      dtype: ['', Validators.required],
      ddescription: ['', Validators.required],
    });
   }

  ngOnInit(): void {
 
///////////////////////////////
    /// BANK SERVICE //////
//////////////////////////////
    this.BankService.getBanks().subscribe((res) =>{
      this.banks = res
      this.bankList = this.banks;
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
      //////////////////////////////////
      /////////// Discount ///////////////
      ////////////////////////////////

            this.DiscountTypesService.getDiscountType().subscribe((res) => {
              this.discountTypeList = res;
            });

             //////////////////////////////////
      /////////// Discount ///////////////
      ////////////////////////////////

      this.BranchService.getBranch().subscribe((res) => {
        this.branchList= res;
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

    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.DiscountTypesService.getDiscountType().subscribe((res) =>{
      this.discountTypeList = res;
    });

    console.log('WWWWWWWWWWW>>>>>>>>', value);
    this.BranchService.getBranch().subscribe((res) =>{
      this.branchList = res;
    });
    
  }

  onSelectBank(bank) {
    console.log('PEEEEEEEE>>>>', bank);
    this.bank_name = bank.bank_name;
    this.swift_code = bank.swift_code;
    this.description = bank.description;
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

 onSelectDiscountType(discountType) {
    console.log('PEEEEEEEE>>>>', discountType);
    this.dtype = discountType.dtype;
    this.ddescription = discountType.ddescription;
  }

  
 onSelectBranch(branch) {
  console.log('PEEEEEEEE>>>>', branch);
  this.branch_name = branch.branch_name;
  this.branch_code = branch.branch_code;
  this.description= branch.description;
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

  
  openDiscountTypes(): void {
    this.isDiscountTypeVisible = true;
  }

  
  openBranches(): void {
    this.isBranchVisible = true;
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

  
  closeDiscountTypes(): void {
    this.isDiscountTypeVisible = false;
  }

   
  closeBranches(): void {
    this.isBranchVisible = false;
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


  submitDiscountTypeForm() {
    const discountType: IDiscountType = {
      ...this.discountTypeForm.value,
      id: v4()
    };
    this.DiscountTypesService.addDiscountType(discountType);
    console.log('DDDDDDDDDD>>>>>>>', discountType);
    this.isDiscountTypeVisible = false;
  }

  
  submitBranchForm() {
    const branch: IBranch = {
      ...this.branchForm.value,
      id: v4(),
      bankId: this.selectedBankId,
    };
    this.BranchService.addBranch(branch);
    console.log('DDDDDDDDDD>>>>>>>', branch);
    this.isBranchVisible = false;
  }

  resetBankForm(value){}
  

  resetBranchForm(value){}


  resetPaymentMethodForm(value){}

  
  resetReceiptTypeForm(value){}

  
  resetDiscountTypeForm(value){}






  
}
