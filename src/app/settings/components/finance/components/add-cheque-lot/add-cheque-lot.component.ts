import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountsService } from '../../services/bank-accounts.service';
import { IBankAccount } from 'src/app/settings/models/bank-account.model';
import { IChequeModel } from 'src/app/settings/models/cheque.model';
import { v4 } from 'uuid';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-add-cheque-lot',
    templateUrl: './add-cheque-lot.component.html',
    styleUrls: ['./add-cheque-lot.component.scss']
})
export class AddChequeLotComponent implements OnInit {
    isAddingChaqueRange: boolean = false;
    @Input()
    isAddChequeLotModalVisible: boolean;

    @Output()
    closeAddChequeLotModalEmitter: EventEmitter<any> = new EventEmitter();

    // bank accounts
    bankAccounts: IBankAccount[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private bankAccountsService: BankAccountsService,
        private msg: NzMessageService
    ) {}

    chequeLotDetailsForm: FormGroup;

    ngOnInit(): void {
        this.chequeLotDetailsForm = this.formBuilder.group({
            bankAccount: ['', Validators.required],
            chequeFrom: ['', Validators.required],
            chequeTo: ['', Validators.required],
            chequeLot: ['', Validators.required]
        });

        this.bankAccountsService
            .getBankAccounts()
            .subscribe(bankAccounts => (this.bankAccounts = bankAccounts));
    }

    closeAddChequeLotModal() {
        this.closeAddChequeLotModalEmitter.emit(true);
    }

    addChequeRange() {
        this.isAddingChaqueRange = true;
        const chequeRange: IChequeModel = {
            id: v4(),
            ...this.chequeLotDetailsForm.value,
            chequeNextCount: this.chequeLotDetailsForm.get('chequeFrom').value
        };

        const bankAccount: IBankAccount = this.chequeLotDetailsForm.get(
            'bankAccount'
        ).value;

        this.bankAccountsService
            .addChequeRange(bankAccount.id, chequeRange)
            .subscribe(
                chequeRange => {
                    console.log(chequeRange);
                    this.msg.success('Cheque Lot Added successfully');
                    this.isAddingChaqueRange = false;
                    this.isAddChequeLotModalVisible = false;
                },
                err => {
                    console.log(err);
                    this.msg.error('Failed to add Cheque Lot');
                    this.isAddingChaqueRange = false;
                    this.isAddChequeLotModalVisible = false;
                }
            );
    }
}
