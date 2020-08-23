import { Component, OnInit } from '@angular/core';
import { AllocationsService } from '../../services/allocations.service';
import { AccountService } from '../../services/account.service';
import { AllocationPolicy, AllocationReceipt } from '../models/allocations.model';
import { NzMessageService } from 'ng-zorro-antd';
import { AgentsService } from '../../../settings/components/agents/services/agents.service';
import { IAgent, IBroker, ISalesRepresentative } from '../../../settings/components/agents/models/agents.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-allocations',
  templateUrl: './allocations.component.html',
  styleUrls: ['./allocations.component.scss']
})
export class AllocationsComponent implements OnInit {

  typeOfIntermediaries = ['Broker', 'Agent', 'Sales Representatives'];

  selectedIntermediaryType = 'Broker';

  allocationReceipt: AllocationReceipt;
  allocationReceiptsList: any[] = [];


  allocationPolicy: AllocationPolicy;

  allocationPoliciesList: any[] = [];
  amount: number;
  selectedRole: any;
   brokers: IBroker[] = [];
   agents: IAgent[] = [];
   salesReps: ISalesRepresentative[] = [];
   selectedInt = '';
   policyTableActive = true;
  isAllocateVisible = false;
  allocationForm: FormGroup;

  constructor(private allocationsService: AllocationsService, private message: NzMessageService, private agentsService: AgentsService, private formBuilder: FormBuilder,) {
    this.allocationForm = this.formBuilder.group({
      policy: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  this.refresh();
  }

  refresh() {

    this.agentsService.getBrokers().subscribe((brokers) => {
      this.brokers = brokers;
    });

    this.agentsService.getAgents().subscribe((agents) => {
      this.agents = agents;
    });

    this.agentsService.getSalesRepresentatives().subscribe((salesReps) => {
      this.salesReps = salesReps;
    });
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
    if (this.selectedInt === '') {
      this.message.warning('Select Intermediary!');
    } else {
      this.policyTableActive = false;
      if ( receipt.allocation_status !== 'Allocated') {
        this.amount = receipt.amount;
        this.selectedRole = receipt;
        this.allocationReceipt = receipt;
        // this.allocationPoliciesList = this.allocationReceiptsList.filter((x) => x.intermediary_id ===  receipt.intermediary_id);
      } else {
        this.message.warning('Receipt Already Allocated!');
      }
    }
  }

  showAllocationModal(value) {
    this.isAllocateVisible = true;
    this.allocationForm
      .get('policy')
      .setValue(value.policy_number);
    this.allocationForm
      .get('amount')
      .setValue(value.balance);
  }

  selectInt(value) {
    this.selectedInt = value;
    this.allocationReceiptsList = this.allocationReceiptsList.filter((x) => x.intermediary_id === value);

    this.allocationPoliciesList = this.allocationPoliciesList.filter((x) => x.intermediary_id === value );
  }

  handleAllocateCancel() {
    this.isAllocateVisible = false;
  }

  handleAllocationOk() {
    this.isAllocateVisible = false;
  }

}
