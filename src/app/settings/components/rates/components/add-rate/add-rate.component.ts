import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RatesService } from '../../services/rates.service';
import 'firebase/storage';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrls: ['./add-rate.component.scss']
})
export class AddRateComponent implements OnInit {

  ratesDetailsForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeAddRateDrawer: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private ratesService: RatesService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.ratesDetailsForm = this.formBuilder.group({
      id: [''],
      insuranceProduct: ['', Validators.required],
      description: ['', Validators.required],
      premiumRate: ['', Validators.required],
      premiumLevy: ['', Validators.required],
      maxLimit: ['', Validators.required],
      minLimit: ['', Validators.required]
    })
  }

  onSubmit() {
    const rate_details = this.ratesDetailsForm.value;
    this.ratesService.addRate(rate_details)
    .then(success => {
      this.msg.success('Rate Added Successfully')
    })
    .catch(err => {
      this.msg.error('Failed To add Rate')
    });
    this.ratesDetailsForm.reset();
    this.closeAddRateDrawer.emit();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.ratesDetailsForm.reset();
  }

  closeDrawer(): void {
    this.closeAddRateDrawer.emit();
  }

}
