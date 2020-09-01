import { Component, OnInit } from '@angular/core';
import { BranchModel, SalesPoint } from '../../models/branch.model';
import { BranchService } from '../../services/branch.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-users-branch',
  templateUrl: './users-branch.component.html',
  styleUrls: ['./users-branch.component.scss']
})
export class UsersBranchComponent implements OnInit {

  branchForm: FormGroup;
  sopForm: FormGroup;
  displayBranch: BranchModel[] = [];
  branch: BranchModel;
  displaySales: SalesPoint[] = [];
  sop: SalesPoint;
  submittedBranch = false;
  submittedSOP = false;

  isBranchVisible = false;
  isSOPVisible = false;

  constructor(
    private branchService: BranchService,
    private fb: FormBuilder,
    private message: NzMessageService, ) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      branch_code: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.sopForm = this.fb.group({
      name: ['', Validators.required],
      sop_code: ['', Validators.required],
      description: ['', Validators.required],
      branch_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.displaySales = [];
    this.branchService.getBranch().subscribe((res) => {
      this.displayBranch = res;
      for (const br of this.displayBranch) {
        this.displaySales = this.displaySales.concat(br.SalesPoint);
      }

      console.log('SOP>>>', this.displaySales);
    });
  }

  onBack(): void {
    console.log('onBack');
  }


  showBranchModal() {
    this.isBranchVisible = true;
  }

  handleBranchCancel() {
    this.isBranchVisible = false;
  }

  handleBranchOk() {
    this.submittedBranch = true;
    if (this.branchForm.valid) {
      const branch: BranchModel = {
        ...this.branchForm.value
      };

      this.branchService.createBranch(branch).subscribe((resBranch) => {
          this.message.success('Branch Successfully Created');
          this.refresh();
        },
        (errBranch) => {
          this.message.error(errBranch);
        });
      this.isBranchVisible = false;
    }
  }

  showSOPModal() {
    this.isSOPVisible = true;
  }

  handleSOPCancel() {
    this.isSOPVisible = false;
  }

  handleSOPOk() {
    this.submittedBranch = true;
    if (this.sopForm.valid) {
      const sop: SalesPoint = {
        ...this.sopForm.value
      };

      this.branchService.createSOP(sop).subscribe((resSOP) => {
          this.message.success('Sales Point Successfully Created');
          this.refresh();
        },
        (errSOP) => {
          this.message.error(errSOP);
        });
      this.isSOPVisible = false;
    }
  }

  get branchFormControl() {
    return this.branchForm.controls;
  }

  get sopFormControl() {
    return this.sopForm.controls;
  }

  editBranchModal(branch) {}
  editSOPModal(sop) {}
}
