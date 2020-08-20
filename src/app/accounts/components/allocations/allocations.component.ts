import { Component, OnInit } from '@angular/core';
import { AllocationsService } from '../../services/allocations.service';
import { AccountService } from '../../services/account.service';
import { AllocationPolicy, AllocationReceipt } from '../models/allocations.model';

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

  constructor(private allocationsService: AllocationsService ) { }

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

  showAllocationModal(value) {}

}
