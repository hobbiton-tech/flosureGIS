import { Component, OnInit } from '@angular/core';
import { IBankAccount } from '../../models/bank-account.model';
import { BankAccountsService } from './services/bank-accounts.service';
import { IChequeModel } from '../../models/cheque.model';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-finance',
    templateUrl: './finance.component.html',
    styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
    financeSetupsIsLoading = false;

    // add bank account modal
    isAddBankAccountModalVisible = false;

    // add cheque lot modal
    isAddChequeLotModalVisible = false;

    bankAccountsTableUpdate = new BehaviorSubject<boolean>(false);
    chequesTableUpdate = new BehaviorSubject<boolean>(false);

    bankAccountsList: IBankAccount[] = [];
    displayBankAccountsList: IBankAccount[] = [];

    chequeList: IChequeModel[] = [];
    displayChequeList: IChequeModel[] = [];

    searchString: string;
    searchChequeString: string;

    constructor(private bankAccountsService: BankAccountsService) {}

    ngOnInit(): void {
        this.financeSetupsIsLoading = true;
        // setTimeout(() => {
        //     this.financeSetupsIsLoading = false;
        // }, 3000);

        this.bankAccountsService.getBankAccounts().subscribe(bankAccounts => {
            this.bankAccountsList = bankAccounts;
            this.displayBankAccountsList = this.bankAccountsList;

            this.financeSetupsIsLoading = false;
        });

        this.bankAccountsService.getChequeRanges().subscribe(chaqueRanges => {
            this.chequeList = chaqueRanges;
            this.displayChequeList = this.chequeList;

            console.log(this.chequeList);
        });

        this.bankAccountsTableUpdate.subscribe(update => {
            update === true ? this.updateBankAccountsTable() : '';
        });

        this.chequesTableUpdate.subscribe(update => {
            update === true ? this.updateChequesTable() : '';
        });
    }

    addBankAccount() {
        this.isAddBankAccountModalVisible = true;
    }

    addChequeLot() {
        this.isAddChequeLotModalVisible = true;
    }

    searchBankAccounts(value: string) {
        if (value === '' || !value) {
            this.displayBankAccountsList = this.bankAccountsList;
        }

        this.displayBankAccountsList = this.bankAccountsList.filter(account => {
            return (
                account.accountName
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                account.branch.toLowerCase().includes(value.toLowerCase()) ||
                account.accountNumber
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
        });
    }

    searchCheques(value: string) {
        if (value === '' || !value) {
            this.displayChequeList = this.chequeList;
        }

        this.displayChequeList = this.chequeList.filter(cheque => {
            return cheque.bankAccount.bank
                .toLowerCase()
                .includes(value.toLowerCase());
        });
    }

    updateBankAccountsTable() {
        this.bankAccountsService.getBankAccounts().subscribe(bankAccounts => {
            this.bankAccountsList = bankAccounts;
            this.displayBankAccountsList = this.bankAccountsList;
        });
    }

    updateChequesTable() {
        this.bankAccountsService.getChequeRanges().subscribe(chaqueRanges => {
            this.chequeList = chaqueRanges;
            this.displayChequeList = this.chequeList;

            console.log(this.chequeList);
        });
    }
}
