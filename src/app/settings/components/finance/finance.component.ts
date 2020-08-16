import { Component, OnInit } from '@angular/core';
import { IBankAccount } from '../../models/bank-account.model';
import { BankAccountsService } from './services/bank-accounts.service';
import { IChequeModel } from '../../models/cheque.model';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
    financeSetupsIsLoading = true;

    // add bank account modal
    isAddBankAccountModalVisible = false;

    // add cheque lot modal
    isAddChequeLotModalVisible = false;

    bankAccountsList: IBankAccount[] = [];
    displayBankAccountsList: IBankAccount[] = [];

    chequeList: IChequeModel[] = [];
    displayChequeList: IChequeModel[] = [];

    searchString: string;
    searchChequeString: string;

    constructor(private bankAccountsService: BankAccountsService) {}

    ngOnInit(): void {
        this.financeSetupsIsLoading = true;
        setTimeout(() => {
            this.financeSetupsIsLoading = false;
        }, 3000);

        this.bankAccountsService.getBankAccounts().subscribe(bankAccounts => {
            this.bankAccountsList = bankAccounts;
            this.displayBankAccountsList = this.bankAccountsList;
        });

        this.bankAccountsService.getChequeRanges().subscribe(chaqueRanges => {
            this.chequeList = chaqueRanges;
            this.displayChequeList = this.chequeList;

            console.log(this.chequeList);
        });
    }

    addBankAccount() {
        this.isAddBankAccountModalVisible = true;
    }

    addChequeLot() {
        this.isAddChequeLotModalVisible = true;
    }

    searchBankAccounts(value: string) {}

    searchCheques(value: string) {}
}
