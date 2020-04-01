import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { PerilService } from '../../../../services/perils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-perils',
  templateUrl: './add-perils.component.html',
  styleUrls: ['./add-perils.component.scss']
})
export class AddPerilsComponent implements OnInit {

  perilDetailsForm: FormGroup;

  //claimid
  claimId: string;

  @Input()
  isAddPerilDrawerVisible: boolean;

  @Output()
  closeAddPerilDrawer: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private perilService: PerilService
  ) { }

  ngOnInit(): void {

    //get cliam id from url
    this.router.params.subscribe(param => {
      this.claimId = param.id;
    })

    this.perilDetailsForm = this.formBuilder.group({
      claimId: this.claimId,
      claimant: ['', Validators.required],
      peril: ['', Validators.required],
      estimatedAmount: ['', Validators.required],
      expiredSection: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log(this.perilDetailsForm.value);
    const peril_details = this.perilDetailsForm.value;
    this.perilService.addPeril(peril_details);
    this.perilDetailsForm.reset();
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.perilDetailsForm.reset();
  }

  closeDrawer(): void {
    this.closeAddPerilDrawer.emit();
  }

}
