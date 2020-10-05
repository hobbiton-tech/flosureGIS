import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TransactionInvoiceService } from '../../../accounts/services/transaction-invoice.service';
import { ILossQuantum } from '../../models/loss-quantum.model';

@Component({
  selector: 'app-salvage-invoice',
  templateUrl: './salvage-invoice.component.html',
  styleUrls: ['./salvage-invoice.component.scss']
})
export class SalvageInvoiceComponent implements OnInit {
  salvageInvoices: any[] = [];
  salvageInvoiceList: any[] = [];
  salvageInvoice: any;
  salvageInvoiceLoading = false;
  isUpdatingSalvageInvoiceStatus = false;
  searchSalvageInvoiceString: string;
  columnAlignment = 'center';

  constructor( private msg: NzMessageService,
               private transactionInvoiceService: TransactionInvoiceService) { }

  ngOnInit(): void {
    this.salvageInvoiceLoading = true;
    this.refresh();
  }

  refresh(): void {
    this.transactionInvoiceService.getTransactiont().subscribe((invoices) => {
      if (invoices.data.length !== 0 || true || true) {
        this.salvageInvoices = invoices.data.filter((x) => x.status === 'Raised' && x.type === 'Salvage');
        this.salvageInvoiceList = this.salvageInvoices;
      } else {
        this.salvageInvoices = [];
      }
      this.salvageInvoiceList = this.salvageInvoices;
      this.salvageInvoiceLoading = false;
    });
  }



  searchInvoices(value: string) {
    if (value === '' || !value) {
      this.salvageInvoiceList = this.salvageInvoices.filter(
        x => x.invoice_number != null
      );
    }

    this.salvageInvoiceList = this.salvageInvoices.filter(
      invoice => {
        if (invoice.invoice_number != null) {
          return (
            invoice.invoice_number
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            invoice.status
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            invoice.remarks
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            invoice.amount
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            invoice.client_name
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

  updateStatus(e) {
    e.status = 'Approved';
    this.isUpdatingSalvageInvoiceStatus = true;

    this.transactionInvoiceService.updateTransaction(e).subscribe((salvageRes) => {
        this.msg.success("Invoice Approved")
        this.refresh();
        this.isUpdatingSalvageInvoiceStatus = false;
      },
      (invoiceError) => {
        this.msg.error(invoiceError);
        this.isUpdatingSalvageInvoiceStatus = false;
      });
  }

  cancel() {

  }

}
