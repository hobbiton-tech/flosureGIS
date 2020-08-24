import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims-service.service';
import { IClaimant } from '../../models/claimant.model';

@Component({
    selector: 'app-add-claimant-modal',
    templateUrl: './add-claimant-modal.component.html',
    styleUrls: ['./add-claimant-modal.component.scss']
})
export class AddClaimantModalComponent implements OnInit {
    isAddingClaimant: boolean = false;

    @Input()
    isAddClaimantModalVisible: boolean;

    @Output()
    closeAddClaimantModalEmitter: EventEmitter<any> = new EventEmitter();

    claimantDetailsForm: FormGroup;

    claimantTypeOptions = [
        { label: 'Insured', value: 'Insured' },
        { label: 'Third Party', value: 'Third Party' }
    ];

    idTypeOptions = [
        { label: 'NRC', value: 'Insured' },
        { label: 'Passport', value: 'Passport' },
        { label: 'License', value: 'License' }
    ];

    genderTypeOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    constructor(
        private msg: NzMessageService,
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService
    ) {}

    ngOnInit(): void {
        this.claimantDetailsForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            type: ['Third Party', Validators.required],
            idNumber: ['', Validators.required],
            idType: ['', Validators.required],
            physicalAddress: ['', Validators.required],
            postalAddress: [''],
            phone: ['', Validators.required],
            email: [''],
            gender: ['']
        });
    }

    closeAddClaimantModal() {
        this.closeAddClaimantModalEmitter.emit(true);
    }

    addClaimant() {
        this.isAddingClaimant = true;
        const claimant: IClaimant = {
            ...this.claimantDetailsForm.value
        };
        this.claimsService.createClaimant(claimant).subscribe(
            claimant => {
                console.log(claimant);
                this.isAddingClaimant = false;
                this.closeAddClaimantModalEmitter.emit(true);
                this.isAddClaimantModalVisible = false;
                this.msg.success('Claimant Successfully Added');
            },
            err => {
                console.log(err);
                this.isAddingClaimant = false;
                this.isAddClaimantModalVisible = false;
                this.msg.error('Failed to add claimant');
            }
        );
    }

    resetForm() {}
}
