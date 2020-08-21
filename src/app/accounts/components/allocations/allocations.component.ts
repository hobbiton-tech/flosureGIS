import { Component, OnInit } from '@angular/core';
import { AllocationsService } from '../../services/allocations.service';
import { AccountService } from '../../services/account.service';
import { AllocationPolicy, AllocationReceipt } from '../models/allocations.model';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit {

  typeOfIntermediaries = ['Broker', 'Agent', 'Sales Representatives', 'Plan Receipt'];

  selectedIntermediaryType = 'Broker';

  allocationReceipt: AllocationReceipt;
  allocationReceiptsList: any[] = [];


  allocationPolicy: AllocationPolicy;

  allocationPoliciesList: any[] = [];
  amount: number;
  selectedRole: any;

  constructor(private allocationsService: AllocationsService, private message: NzMessageService, ) { }

  ngOnInit(): void {

  this.refresh();
  }

  refresh() {
    this.allocationsService.getAllocationReceipt().subscribe((res) => {
      this.allocationReceiptsList = res.data.filter((x) => x.intermediary_type === this.selectedIntermediaryType);
    });


    this.allocationsService.getAllocationPolicy().subscribe((res) => {
      this.allocationPoliciesList = res.data;
    });
  }

  selectIntermediaryType(value) {
    this.selectedIntermediaryType = value;

    this.refresh();
  }

  showAllocationRole(receipt) {
    if ( receipt.allocation_status !== 'Allocated') {
      this.amount = receipt.amount;
      this.selectedRole = receipt;
      this.allocationReceipt = receipt;
      this.allocationPoliciesList = this.allocationReceiptsList.filter((x) => x.intermediary_id ===  receipt.intermediary_id);
    } else {
      this.message.warning('Receipt Already Allocated!');
    }
  }

  showAllocationModal(value) {}

}
