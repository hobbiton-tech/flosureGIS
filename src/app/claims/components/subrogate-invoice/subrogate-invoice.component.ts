import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TransactionInvoiceService } from '../../../accounts/services/transaction-invoice.service';

@Component({
  selector: 'app-subrogate-invoice',
  templateUrl: './subrogate-invoice.component.html',
  styleUrls: ['./subrogate-invoice.component.scss']
})
export class SubrogateInvoiceComponent implements OnInit {

  subrogationInvoices: any[] = [];
  subrogationInvoiceList: any[] = [];
  subrogationInvoice: any;
  subrogationInvoiceLoading = false;
  isUpdatingSubrogationInvoiceStatus = false;
  searchSubrogationInvoiceString: string;
  columnAlignment = 'center';

  constructor(private msg: NzMessageService,
              private transactionInvoiceService: TransactionInvoiceService) { }

  ngOnInit(): void {
    this.subrogationInvoiceLoading = true;
    this.refresh();
  }


  refresh(): void {
    this.transactionInvoiceService.getTransactiont().subscribe((invoices) => {
      if (invoices.data.length !== 0 || true || true) {
        this.subrogationInvoices = invoices.data.filter((x) => x.type === 'Subrogation');
        this.subrogationInvoiceList = this.subrogationInvoices;
      } else {
        this.subrogationInvoices = [];
      }
      this.subrogationInvoiceList = this.subrogationInvoices;
      this.subrogationInvoiceLoading = false;
    });
  }


  searchInvoices(value: string) {
    if (value === '' || !value) {
      this.subrogationInvoiceList = this.subrogationInvoices.filter(
        x => x.invoice_number != null
      );
    }

    this.subrogationInvoiceList = this.subrogationInvoices.filter(
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
    this.isUpdatingSubrogationInvoiceStatus = true;

    this.transactionInvoiceService.updateTransaction(e).subscribe((salvageRes) => {
        this.msg.success("Invoice Approved")
        this.refresh();
        this.isUpdatingSubrogationInvoiceStatus = false;
      },
      (invoiceError) => {
        this.msg.error(invoiceError);
        this.isUpdatingSubrogationInvoiceStatus = false;
      });
  }

  cancel() {

  }

}
