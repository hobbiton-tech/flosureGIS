import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-sector',
  templateUrl: './create-sector.component.html',
  styleUrls: ['./create-sector.component.scss']
})
export class CreateSectorComponent implements OnInit {

  createSectorForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeSectorDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) { 
    this.createSectorForm = this._formBuilder.group({
      type: '',
      short_description: '',
      account_type: '',
      commission_rate: '',
      vat_rate: '',
      withholding_tax_rate: ''
    })
  }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closeSectorDrawer.emit();
  }

}
