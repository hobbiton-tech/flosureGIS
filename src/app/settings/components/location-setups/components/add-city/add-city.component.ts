import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IProvince } from '../../models/province.model';

@Component({
    selector: 'app-add-city',
    templateUrl: './add-city.component.html',
    styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
    isAddingCity: boolean = false;

    @Input()
    isAddCityModalVisible: boolean;

    @Output()
    closeAddCityModalEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private msg: NzMessageService
    ) {}

    cityDetailsForm: FormGroup;

    provincesList: IProvince[] = [];
    selectedProvince: IProvince;

    ngOnInit(): void {
        this.cityDetailsForm = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            province: ['', Validators.required]
        });

        this.locationService.getProvinces().subscribe(provinces => {
            this.provincesList = provinces;
        });
    }

    closeAddCityModal() {
        this.closeAddCityModalEmitter.emit(true);
    }

    addCity() {
        this.selectedProvince = this.cityDetailsForm.get('province').value;
        this.isAddingCity = true;

        const city = {
            ...this.cityDetailsForm.value
        };

        this.locationService.addCity(this.selectedProvince.id, city).subscribe(
            city => {
                console.log('added city :=> ', city);
                this.msg.success('City added successfully');
                this.isAddingCity = false;
                this.closeAddCityModal();
            },
            err => {
                console.log('error :=> ', err);
                this.msg.error('failed to add City');
                this.isAddingCity = false;
                this.isAddCityModalVisible = false;
            }
        );
    }
}
