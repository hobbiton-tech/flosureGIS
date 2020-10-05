import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { Claim } from '../../models/claim.model';
import { ISalvage } from '../../models/salvage.model';
import { ILossQuantum } from '../../models/loss-quantum.model';
import { NzMessageService } from 'ng-zorro-antd';
import { TransactionInvoiceService } from '../../../accounts/services/transaction-invoice.service';

@Component({
  selector: 'app-salvages',
  templateUrl: './salvages.component.html',
  styleUrls: ['./salvages.component.scss']
})
export class SalvagesComponent implements OnInit {
  salvages: ILossQuantum[] = [];
  salvagesList: ILossQuantum[] = [];
  salvage: ILossQuantum;
  salvagesLoading = false;
  isUpdatingSalvageStatus = false;
  searchSalvagesString: string;
  columnAlignment = 'center';
  isVisible = false;
  saleAmount?: number;
  bidderName: string;

  constructor( private claimService: ClaimsService,
               private msg: NzMessageService,
               private transactionInvoiceService: TransactionInvoiceService
               ) { }

  ngOnInit(): void {
    this.salvagesLoading = true;
    this.refresh();
  }

  refresh() {
    // this.claimService.getClaims().subscribe((claims) => {
    //   this.claims = claims.filter((x) => x.claimStatus === 'Approved' && x.lossQuantum.lossType ==='Total Loss');
    //   this.claimsList = this.claims;
    //   console.log('Salvages>>>', this.claimsList);
    //   this.salvagesLoading = false;
    // })

    this.claimService.getSalvages().subscribe((salvages) => {
      this.salvages = salvages.filter((x) => x.salvages.bidStatus !== null);
      this.salvagesList = this.salvages;
      this.salvagesLoading = false;
    });
  }


  searchSalvages(value: string) {
    if (value === '' || !value) {
      this.salvagesList = this.salvages.filter(
        x => x.salvages.salvageNumber != null
      );
    }

    this.salvagesList = this.salvages.filter(
      salvage => {
        if (salvage.salvages.salvageNumber != null) {
          return (
            salvage.salvages.salvageNumber
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            salvage.salvages.bidStatus
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

  updateStatus(e:ILossQuantum, value) {
    e.salvages.bidStatus = value;
    this.isUpdatingSalvageStatus = true;

    this.claimService.updateSalvages(e).subscribe((salvageRes) => {
      this.msg.success("Bidding Successfully" + ' ' + value)
      this.refresh();
        this.isUpdatingSalvageStatus = false;
    },
      (salvageError) => {
        this.msg.error(salvageError);
        this.isUpdatingSalvageStatus = false;
      });
  }

  cancel() {

  }

  showModal(e, value): void {
    this.isVisible = true;
    e.salvages.bidStatus = value;
    this.salvage = e;
  }


  handleOk() {
    this.isUpdatingSalvageStatus = true;
    this.salvage.salvages.saleAmount = this.saleAmount;

    const txnInvoice: any = {
      invoice_number: 'test',
      remarks: 'Invoice Raised',
      amount: Number(this.saleAmount),
      status: 'Raised',
      transaction_id: this.salvage.salvages.id,
      type: 'Salvage',
      client_name: this.bidderName
    }

    this.claimService.updateSalvages(this.salvage).subscribe((salvageRes) => {
        this.msg.success("Bidding Successfully" + ' ' + this.salvage.salvages.bidStatus)
        this.refresh();
        this.transactionInvoiceService.createTransaction(txnInvoice).subscribe((txn) => {}, (errTxn) => {
          this.msg.error(errTxn);
        });
        this.isUpdatingSalvageStatus = false;
        this.isVisible = false;
      },
      (salvageError) => {
        this.msg.error(salvageError);
        this.isUpdatingSalvageStatus = false;
      });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
