import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Policy } from '../../../../../underwriting/models/policy.model';
import { IReceiptModel } from '../../../models/receipts.model';
import { DebitNote } from '../../../../../underwriting/documents/models/documents.model';
import { AccountService } from '../../../../services/account.service';
import { PoliciesService } from '../../../../../underwriting/services/policies.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import _ from 'lodash';

@Component({
  selector: 'app-plan-receipt',
  templateUrl: './plan-receipt.component.html',
  styleUrls: ['./plan-receipt.component.scss']
})
export class PlanReceiptComponent implements OnInit {


  cancelForm: FormGroup;
  reinstateForm: FormGroup;
  submitted = false;
  receiptsCount = 0;
  receiptedList: IReceiptModel[] = [];
  receipt: IReceiptModel;
  today = new Date();
  clientName = '';
  cancelReceipt: IReceiptModel = new IReceiptModel();
  reinstateReceipt: IReceiptModel = new IReceiptModel();
  size = 'large';
  paymentMethod = '';

  policyAmount = 0;

  cancelReceiptList = [];

  isVisible = false;
  isCancelVisible = false;
  isReinstateVisible = false;
  isOkLoading = false;
  policyNumber = '';
  user = '';
  _id = '';
  isConfirmLoading = false;
  sourceOfBusiness: string;
  intermediaryName: string;
  receiptNewCount: number;

  constructor(
    private receiptService: AccountService,
    private policeServices: PoliciesService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {

    this.cancelForm = this.formBuilder.group({
      remarks: ['', Validators.required],
    });
    this.reinstateForm = this.formBuilder.group({
      remarks: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.refresh()
  }


  refresh() {
    this.receiptService.getReciepts().subscribe((receipts) => {
      this.receiptedList = _.filter(
        receipts.data,
        (x) =>
          x.receipt_status === 'Receipted' &&
          x.source_of_business === 'Plan-Receipt'
      );

      console.log('======= Receipt List =======');
      console.log(receipts.data);

      this.cancelReceiptList = _.filter(
        receipts.data,
        (x) =>
          x.receipt_status === 'Cancelled' &&
          x.source_of_business === 'Plan-Receipt'
      );

      console.log('======= Cancelled Receipt List =======');
      console.log(this.cancelReceiptList);

      this.receiptNewCount = receipts.length;
      console.log('Total Number of Receipts>>>>', this.receiptNewCount);
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  showCancelModal(receipt: IReceiptModel) {
    this.isCancelVisible = true;
    this.cancelReceipt = receipt;
  }

  cancelCancellation() {
    this.isCancelVisible = false;
  }

  async onCancel() {
    this.cancelReceipt.receipt_status = 'Cancelled';
    this.cancelReceipt.remarks = this.cancelForm.controls.remarks.value;
    console.log('<++++++++++++++++++CLAIN+++++++++>');
    console.log(this.cancelReceipt);
    this.receiptService.updateReceipt(this.cancelReceipt).subscribe((res) => {
      this.message.success('Receipt Successfully Updated');
      this.refresh()
      // const cancel: any[] = res.data.filter((x) => {
      //   x.receipt_status === 'Cancelled' &&
      //   x.source_of_business === 'Plan-Receipt';
      // });
      // this.cancelReceiptList = [...cancel];
    }, (err) => {
      console.log('Check ERR>>>>', err);
      this.message.warning('Receipt Failed');
    });
    this.isCancelVisible = false;
  }

  showReinstateModal(receipt: IReceiptModel) {
    this.isReinstateVisible = true;
    this.reinstateReceipt = receipt;
  }

  cancelReinstate() {
    this.isReinstateVisible = false;
  }

  async onReinstate() {
    this.reinstateReceipt.receipt_status = 'Receipted';
    this.reinstateReceipt.remarks = this.cancelForm.controls.remarks.value;
    console.log('<++++++++++++++++++CLAIN+++++++++>');
    console.log(this.reinstateReceipt);
    this.receiptService.updateReceipt(this.reinstateReceipt).subscribe((res) => {
      this.message.success('Receipt Successfully Updated');
      this.refresh();
      // const reInst: any[] = res.data.filter((x) => {
      //   x.receipt_status === 'Receipted' &&
      //   x.source_of_business === 'Plan-Receipt';
      // });
      //
      // this.receiptedList = [...reInst];
    }, (err) => {
      console.log('Check ERR>>>>', err);
      this.message.warning('Receipt Failed');
    });
    this.isReinstateVisible = false;
  }

  // pop Confirm
  cancel() {}

  generateID(id: number) {
    console.log('++++++++++++ID++++++++++++', id);
    console.log(id);
    this.router.navigateByUrl('/flosure/accounts/view-receipt/' + id);
    // this.isConfirmLoading = true;
    // this.generateDocuments();
  }

}
