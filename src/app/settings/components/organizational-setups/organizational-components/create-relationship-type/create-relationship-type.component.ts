import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-relationship-type',
  templateUrl: './create-relationship-type.component.html',
  styleUrls: ['./create-relationship-type.component.scss']
})
export class CreateRelationshipTypeComponent implements OnInit {

  createRelationshipTypeForm: FormGroup;

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeRelationshipTypeDrawer: EventEmitter<any> = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {
    this.createRelationshipTypeForm = this._formBuilder.group({
      type: '',
      description: ''
    })

   }

  ngOnInit(): void {
  }

  closeDrawer(): void {
    this.closeRelationshipTypeDrawer.emit();
  }

}
