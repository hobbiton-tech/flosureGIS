import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleModelService } from '../services/vehicle-model.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IVehicleModel } from '../models/vehicle.model';

@Component({
    selector: 'app-vehicle-model',
    templateUrl: './vehicle-model.component.html',
    styleUrls: ['./vehicle-model.component.scss'],
})
export class VehicleModelComponent implements OnInit {
    //loading feedback
    addingVehicleModel: boolean = false;

    @Input()
    isAddVehicleModelsFormDrawerVisible: boolean;

    @Output()
    closeAddVehicleModelsFormDrawerVisible: EventEmitter<
        any
    > = new EventEmitter();

    update: boolean = true;

    vehicleModelForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private vehicleModelService: VehicleModelService,
        private msg: NzMessageService
    ) {
        this.vehicleModelForm = this.formBuilder.group({
            vehicleModel: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {}

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.vehicleModelForm.reset();
    }

    closeDrawer(): void {
        this.closeAddVehicleModelsFormDrawerVisible.emit(true);
    }

    async addVehicleModel(vehicleModel: IVehicleModel) {
        this.addingVehicleModel = true;
        await this.vehicleModelService.addVehicleModel(vehicleModel).subscribe(
            (res) => {
                this.msg.success('Vehicle Type added successfully');
                this.addingVehicleModel = false;
                this.closeDrawer();
            },
            (err) => {
                this.msg.error('Failed to add Vehicle Type');
                this.addingVehicleModel = false;
            }
        );
    }

    submitVehicleModel() {
        for (let i in this.vehicleModelForm.controls) {
            /// validation;
            this.vehicleModelForm.controls[i].markAsDirty();
            this.vehicleModelForm.controls[i].updateValueAndValidity();
        }

        if (this.vehicleModelForm.valid || !this.vehicleModelForm.valid) {
            this.addVehicleModel(this.vehicleModelForm.value).then((res) => {
                this.vehicleModelForm.reset();
            });
        }
    }
}
