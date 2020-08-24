import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimsService } from 'src/app/claims/services/claims-service.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-add-service-provider',
    templateUrl: './add-service-provider.component.html',
    styleUrls: ['./add-service-provider.component.scss']
})
export class AddServiceProviderComponent implements OnInit {
    isAddingServiceProvider: boolean = false;

    @Input()
    isAddServiceProviderModalVisible: boolean;

    @Output()
    closeAddServiceProviderModalEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService,
        private msg: NzMessageService
    ) {}

    serviceProviderDetailsForm: FormGroup;

    serviceProviderTypeOptions = [
        { label: 'Garage', value: 'Garage' },
        { label: 'Repairers', value: 'Repairers' },
        { label: 'Panel Beaters', value: 'Panel Beaters' }
    ];

    ngOnInit(): void {
        this.serviceProviderDetailsForm = this.formBuilder.group({
            name: ['', Validators.required],
            type: ['', Validators.required],
            tPin: [''],
            physicalAddress: ['', Validators.required],
            postalAddress: [''],
            phone: ['', Validators.required],
            emailAddress: [''],
            representativeFirsName: [''],
            representativeLastName: [''],
            representativePhone: [''],
            representativeEmail: ['']
        });
    }

    closeAddServiceProviderModal() {
        this.closeAddServiceProviderModalEmitter.emit(true);
    }

    addServiceProvider() {
        this.isAddingServiceProvider = true;

        const serviceProvider = {
            ...this.serviceProviderDetailsForm.value
        };

        this.claimsService.createServiceProvider(serviceProvider).subscribe(
            serviceProvider => {
                console.log(serviceProvider);
                this.msg.success('Service Provider added Successfully');
                this.isAddingServiceProvider = false;
                this.isAddServiceProviderModalVisible = false;
            },
            err => {
                console.log(err);
                this.msg.error('Failed to add Service Provider');
                this.isAddingServiceProvider = false;
                this.isAddServiceProviderModalVisible = false;
            }
        );
    }
}
