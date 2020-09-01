import { Component, OnInit } from '@angular/core';
import { DepartmentModel } from '../../../models/department/department.model';
import { NzMessageService } from 'ng-zorro-antd';
import { DepartmentService } from '../services/department.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchModel } from '../../../../users/models/branch.model';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  displayDepartment: DepartmentModel[] = [];
  departmentForm: FormGroup;
  isDepartmentVisible = false;
  submittedDepartment = false;

  constructor(
    private message: NzMessageService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
   this.departmentService.getDepartment().subscribe((res) => {
     this.displayDepartment = res;
   });
  }

  onBack(): void {
    console.log('onBack');
  }

  showDepartmentModal() {
    this.isDepartmentVisible = true;
  }

  handleDepartmentCancel() {
    this.isDepartmentVisible = false;
  }

  handleDepartmentOk() {
    this.submittedDepartment = true;
    if (this.departmentForm.valid) {
      const department: DepartmentModel = {
        ...this.departmentForm.value
      };

      this.departmentService.createDepartment(department).subscribe((resDepartment) => {
          this.message.success('Department Successfully Created');
          this.refresh();
        },
        (errDepartment) => {
          this.message.error(errDepartment);
        });
      this.isDepartmentVisible = false;
    }
  }


  get departmentFormControl() {
    return this.departmentForm.controls;
  }

  editDepartmentModal(department) {}

}
