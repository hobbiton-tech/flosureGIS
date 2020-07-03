// import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { IBank } from '../../../../models/finance/bank.model'
// import { v4 } from 'uuid';
// import { BankService } from '../bank-setups/services/bank.service'
// import { from } from 'rxjs';
// import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// @Component({
//   selector: 'app-bank-setups',
//   templateUrl: './bank-setups.component.html',
//   styleUrls: ['./bank-setups.component.scss']
// })
// export class BankSetupsComponent implements OnInit {

//   @Input()
//   isBankFormDrawerVisible: boolean;

//   @Input() 
//   bank_name: any;

  
//   @Input() 
//   branch_name: any;

  
//   @Input() 
//   branch_code: any;

  
//   @Input() 
//   swift_code: any;


//   @Output()
//   closeBankFormDrawerVisible: EventEmitter<any> = new EventEmitter();

//   bankForm: FormGroup;

//   constructor(
//     private formBuilder: FormBuilder,
//     private bankService: BankService
//   ) { 
//     this.bankForm = formBuilder.group({
//       bank_name: ['', Validators.required],
//       branch_name: ['', Validators.required],
//       swift_code: ['', Validators.required],
//     });
//   }

//   ngOnInit(): void { 
//     this.closeBankFormDrawerVisible.emit();
//   }

//   submitBankForm() {
//     const bank: IBank = {
//         ...this.bankForm.value,
//         id: v4(),
//     };
//     this.bankService.addBank(bank);
//     this.closeBankFormDrawerVisible.emit();
//     this.bankForm.reset();
// }

// resetBankForm() {
//     this.bankForm.reset();
// }
// }
