import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleMakeService } from '../services/vehicle-make.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IVehicleMake } from '../models/vehicle.model';

@Component({
    selector: 'app-vehicle-make',
    templateUrl: './vehicle-make.component.html',
    styleUrls: ['./vehicle-make.component.scss'],
})
export class VehicleMakeComponent implements OnInit {
    //loading feedback
    addingVehicleMake: boolean = false;

    @Input()
    isAddVehicleMakesFormDrawerVisible: boolean;

    @Output()
    closeAddVehicleMakesFormDrawerVisible: EventEmitter<
        any
    > = new EventEmitter();

    update: boolean = true;

    vehicleMakeForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private vehicleMakeService: VehicleMakeService,
        private msg: NzMessageService
    ) {
        this.vehicleMakeForm = this.formBuilder.group({
            vehicleMake: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {}

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.vehicleMakeForm.reset();
    }

    closeDrawer(): void {
        this.closeAddVehicleMakesFormDrawerVisible.emit(true);
    }

    async addVehicleMake(vehicleMake: IVehicleMake) {
        this.addingVehicleMake = true;
        await this.vehicleMakeService.addVehicleMake(vehicleMake).subscribe(
            (res) => {
                this.msg.success('Vehicle Make added successfully');
                this.addingVehicleMake = false;
                this.closeDrawer();
            },
            (err) => {
                this.msg.error('Failed to add Vehicle Make');
                this.addingVehicleMake = false;
            }
        );
    }

    submitVehicleMake() {
        for (let i in this.vehicleMakeForm.controls) {
            /// validation;
            this.vehicleMakeForm.controls[i].markAsDirty();
            this.vehicleMakeForm.controls[i].updateValueAndValidity();
        }

        if (this.vehicleMakeForm.valid || !this.vehicleMakeForm.valid) {
            this.addVehicleMake(this.vehicleMakeForm.value).then((res) => {
                this.vehicleMakeForm.reset();
            });
        }
    }
}
