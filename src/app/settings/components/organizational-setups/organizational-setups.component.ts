import { Component, OnInit } from '@angular/core';
import { generateCurrency } from 'src/app/settings/data/currency.data';
import { generateClients } from 'src/app/settings/data/client-type.data';
import { generateAccounts } from 'src/app/settings/data/account.data';
import { createAccount } from 'src/app/settings/data/account.data';
import { generateAccountTypes } from 'src/app/settings/data/account-type.data';
import { generatePaymentModes } from 'src/app/settings/data/payment.data';
import { IAccount } from '../../models/organizational/account.model';
import { generateRelationshipTypes } from 'src/app/settings/data/relationship-type.data';
import { generateSectors } from 'src/app/settings/data/sector.data';

@Component({
  selector: 'app-organizational-setups',
  templateUrl: './organizational-setups.component.html',
  styleUrls: ['./organizational-setups.component.scss']
})
export class OrganizationalSetupsComponent implements OnInit {
  currencyList = generateCurrency();
  clientList = generateClients();
  accountList = generateAccounts();
  account = createAccount();
  accountTypes = generateAccountTypes();
  paymentModes = generatePaymentModes();
  relationshipTypes = generateRelationshipTypes();
  sectorsList = generateSectors();

  visible = false;
  newAccountTypeFormDrawerVisible = false;
  newAccountFormDrawerVisible = false;
  newClientTypeFormDrawerVisible = false;
  newCurrencyFormDrawerVisible = false;
  newPaymentModeFormDrawerVisible = false;
  newRelationshipTypeFormDrawerVisible = false;
  newSectorFormDrawerVisible = false;


  accountsDrawerVisible = false;
  selectedAccount: IAccount;

  constructor() { }

  ngOnInit(): void {
    this.selectedAccount = this.accountList[0];
    console.log(this.selectedAccount);
  }

  openAccountsDrawer(account: IAccount) {
   this.selectedAccount = account;
   this.accountsDrawerVisible = true; 
  }

  openAccountTypeFormDrawer() {
    this.newAccountTypeFormDrawerVisible = true;
  }

  openAccountFormDrawer() {
    this.newAccountFormDrawerVisible = true;
  }

  openClientTypeFormDrawer() {
    this.newClientTypeFormDrawerVisible = true;
  }

  openCurrencyFormDrawer() {
    this.newCurrencyFormDrawerVisible = true;
  }

  openPaymentModeFormDrawer() {
    this.newPaymentModeFormDrawerVisible = true;
  }

  openRelationshipTypeFormDrawer() {
    this.newRelationshipTypeFormDrawerVisible = true;
  }

  openSectorFormDrawer() {
    this.newSectorFormDrawerVisible = true;
  }
}
