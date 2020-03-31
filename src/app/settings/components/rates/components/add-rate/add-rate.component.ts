import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RatesService } from '../../services/rates.service';
import 'firebase/storage';
import 'firebase/firestore';

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrls: ['./add-rate.component.scss']
})
export class AddRateComponent implements OnInit {

  ratesDetailsForm: FormGroup;

  @Input()
  isAddRateDrawerVisible: boolean;

  @Output()
  closeAddRateDrawer: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private ratesService: RatesService
  ) { }

  ngOnInit(): void {
    this.ratesDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      insuranceProduct: ['', Validators.required],
      premiumRate: ['', Validators.required],
      premiumLevy: ['', Validators.required],
      taxRate: ['', Validators.required]
    })
  }

  onSubmit() {
    const rate_details = this.ratesDetailsForm.value;
    this.ratesService.addRate(rate_details);
    this.ratesDetailsForm.reset();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.ratesDetailsForm.reset();
  }

  closeRateDrawer(): void {
    this.closeAddRateDrawer.emit();
  }

}
