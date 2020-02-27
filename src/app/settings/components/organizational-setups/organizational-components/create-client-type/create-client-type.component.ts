import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-client-type',
  templateUrl: './create-client-type.component.html',
  styleUrls: ['./create-client-type.component.scss']
})
export class CreateClientTypeComponent implements OnInit {

  createClientTypeForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeClientTypeDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {
    this.createClientTypeForm = this._formBuilder.group({
      type: '',
      description: ''
    })
   }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closeClientTypeDrawer.emit();
  }

}
