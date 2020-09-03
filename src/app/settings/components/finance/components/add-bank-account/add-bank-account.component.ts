import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountsService } from '../../services/bank-accounts.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-add-bank-account',
    templateUrl: './add-bank-account.component.html',
    styleUrls: ['./add-bank-account.component.scss']
})
export class AddBankAccountComponent implements OnInit {
    isAddingBankAccount: boolean = false;

    @Input()
    isAddBankAccountModalVisible: boolean;

    @Output()
    closeAddBankAccountModalEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private bankAccountsService: BankAccountsService,
        private msg: NzMessageService
    ) {}

    bankAccountDetailsForm: FormGroup;

    ngOnInit(): void {
        this.bankAccountDetailsForm = this.formBuilder.group({
            bank: ['', Validators.required],
            branch: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required]
        });
    }

    closeAddBankAccountModal() {
        this.closeAddBankAccountModalEmitter.emit(true);
    }

    addBankAccount() {
        this.isAddingBankAccount = true;
        const bankAccountDetails = {
            ...this.bankAccountDetailsForm.value
        };

        this.bankAccountsService.addBankAccount(bankAccountDetails).subscribe(
            bankAccount => {
                console.log(bankAccount);
                this.msg.success('Bank Account added successfully');
                this.isAddingBankAccount = false;
                // this.isAddBankAccountModalVisible = false;
                this.closeAddBankAccountModal();
            },
            err => {
                console.log(err);
                this.msg.error('failed to add bank Account');
                this.isAddingBankAccount = false;
                this.isAddBankAccountModalVisible = false;
            }
        );
    }
}
