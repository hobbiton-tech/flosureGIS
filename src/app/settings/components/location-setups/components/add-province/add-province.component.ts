import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-add-province',
    templateUrl: './add-province.component.html',
    styleUrls: ['./add-province.component.scss']
})
export class AddProvinceComponent implements OnInit {
    isAddingProvince: boolean = false;

    @Input()
    isAddProvinceModalVisible: boolean;

    @Output()
    closeAddProvinceModalEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private msg: NzMessageService
    ) {}

    provinceDetailsForm: FormGroup;

    ngOnInit(): void {
        this.provinceDetailsForm = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required]
        });
    }

    closeAddProvinceModal() {
        this.closeAddProvinceModalEmitter.emit(true);
    }

    addProvince() {
        this.isAddingProvince = true;

        const province = {
            ...this.provinceDetailsForm.value
        };

        this.locationService.addProvince(province).subscribe(
            province => {
                console.log('added province :=> ', province);
                this.msg.success('Province added successfully');
                this.isAddingProvince = false;
                this.closeAddProvinceModal();
            },
            err => {
                console.log('error :=> ', err);
                this.msg.error('failed to add Province');
                this.isAddingProvince = false;
                this.isAddProvinceModalVisible = false;
            }
        );
    }
}
