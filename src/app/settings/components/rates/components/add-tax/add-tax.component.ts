import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { RatesService } from '../../services/rates.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.scss']
})
export class AddTaxComponent implements OnInit {
  taxDetailsForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeAddTaxDrawer: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private ratesService: RatesService,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
    this.taxDetailsForm = this.formBuilder.group({
      id: [''],
      shortName: ['', Validators.required],
      description: ['', Validators.required],
      rate: ['', Validators.required]
    })
  }

  onSubmit() {
    const tax_details = this.taxDetailsForm.value;
    this.ratesService.addTaxes(tax_details)
    .then(success => {
      this.msg.success('Tax Added Successfully')
    })
    .catch(err => {
      this.msg.error('Failed to add Tax')
    });
    this.taxDetailsForm.reset();
    this.closeAddTaxDrawer.emit();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.taxDetailsForm.reset();
  }

  closeDrawer(): void {
    this.closeAddTaxDrawer.emit();
  }

}
