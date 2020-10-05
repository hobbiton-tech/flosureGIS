import { Component, OnInit } from '@angular/core';
import { ClaimsService } from '../../services/claims-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TransactionInvoiceService } from '../../../accounts/services/transaction-invoice.service';
import { Claim } from '../../models/claim.model';
import { ILossQuantum } from '../../models/loss-quantum.model';

@Component({
  selector: 'app-subrogations',
  templateUrl: './subrogations.component.html',
  styleUrls: ['./subrogations.component.scss']
})
export class SubrogationsComponent implements OnInit {

  subrogationLoading = false;
  isUpdatingSubrogationStatus = false;
  searchSubrogationString: string;
  columnAlignment = 'center';
  isVisible = false;
  claimsList: Claim[] = [];
  claims: Claim[] = [];
  claim: Claim;
  clientName = '';
  claimAmount: number;

  constructor(private claimService: ClaimsService,
              private msg: NzMessageService,
              private transactionInvoiceService: TransactionInvoiceService) { }

  ngOnInit(): void {
    this.subrogationLoading = true;
    this.refresh();
  }


  refresh() {
    this.claimService.getClaims().subscribe((claims) => {
      this.claims = claims.filter((x) => x.claimStatus === 'Approved' && x.subrogation !== 'NA');
      this.claimsList = this.claims;
      console.log('Salvages>>>', this.claimsList);
      this.subrogationLoading = false;
    });

    // this.claimService.getSalvages().subscribe((salvages) => {
    //   this.salvages = salvages.filter((x) => x.salvages.bidStatus !== null);
    //   this.salvagesList = this.salvages;
    //   this.salvagesLoading = false;
    // });
  }


  searchSubrigations(value: string) {
    if (value === '' || !value) {
      this.claimsList = this.claims.filter(
        x => x.claimNumber != null
      );
    }

    this.claimsList = this.claims.filter(
      claim => {
        if (claim.claimNumber != null) {
          return (
            claim.claimNumber
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.subrogation
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.lossQuantum.dischargeAmount.toString()
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.claimStatus
              .toLowerCase()
              .includes(value.toLowerCase()) ||
            claim.claimant.firstName
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      }
    );
  }

  updateStatus(e: Claim, value) {
    e.subrogation = value;
    this.isUpdatingSubrogationStatus = true;

    this.claimService.updateClaim(e.id, e).subscribe((claimRes) => {
        this.msg.success('Invoice Raised Successfully' + ' ' + value);
        this.refresh();
        this.isUpdatingSubrogationStatus = false;
      },
      (claimError) => {
        this.msg.error(claimError);
        this.isUpdatingSubrogationStatus = false;
      });
  }

  cancel() {

  }

  showModal(e, value): void {
    this.isVisible = true;
    e.subrogation = value;
    this.claim = e;
    this.claimAmount = this.claim.lossQuantum.dischargeAmount;
  }


  handleOk() {
    this.isUpdatingSubrogationStatus = true;

    const txnInvoice: any = {
      invoice_number: 'test',
      remarks: 'Invoice Raised',
      amount: Number(this.claim.lossQuantum.dischargeAmount),
      status: 'Raised',
      transaction_id: this.claim.id,
      type: 'Subrogation',
      client_name: this.clientName
    };

    this.claimService.updateClaim(this.claim.id, this.claim).subscribe((claimRes) => {
        this.msg.success('Invoice Successfully' + ' ' + this.claim.subrogation);
        this.refresh();
        this.transactionInvoiceService.createTransaction(txnInvoice).subscribe((txn) => {}, (errTxn) => {
          this.msg.error(errTxn);
        });
        this.isUpdatingSubrogationStatus = false;
        this.isVisible = false;
      },
      (salvageError) => {
        this.msg.error(salvageError);
        this.isUpdatingSubrogationStatus = false;
      });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }




}
