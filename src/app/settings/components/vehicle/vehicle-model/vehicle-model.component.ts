import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehicleModelService } from '../services/vehicle-model.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IVehicleModel, IVehicleMake } from '../models/vehicle.model';
import { VehicleMakeService } from '../services/vehicle-make.service';
import { ActivatedRoute } from '@angular/router';

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

    bodyMakes: IVehicleMake[];

    vehicleMakeId: string;

    vehicleModelId: string;

    selectedVehicleMake: IVehicleMake;

    // get vehicleId(){
    //   return this.vehicleModelForm.get('vehicleMakeId').value
    // }

    // id = this.vehicleModelForm.controls['vehicleMake'].value;

    constructor(
        private formBuilder: FormBuilder,
        private vehicleModelService: VehicleModelService,
        private vehicleMakeService: VehicleMakeService,
        private msg: NzMessageService,
        private route: ActivatedRoute
    ) {
        this.vehicleModelForm = this.formBuilder.group({
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe((param) => {
            this.vehicleMakeId = param.vehicleMakeId;
        });

        this.vehicleMakeService.getVehicleMake().subscribe((bodyMake) => {
            this.bodyMakes = bodyMake;
        });
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.vehicleModelForm.reset();
    }

    closeDrawer(): void {
        this.closeAddVehicleModelsFormDrawerVisible.emit(true);
    }

    async addVehicleModel(vehicleModel: IVehicleModel) {
        this.addingVehicleModel = true;
        console.log(';jsjsjsjs', this.vehicleModelForm.controls['vehicleMake'].value)
        await this.vehicleModelService
            .addVehicleModel(vehicleModel, this.vehicleModelForm.controls['vehicleMake'].value)
            .subscribe(
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

    reloadVehicleMake(){
      this.vehicleMakeService.getVehicleMake().subscribe(makes => {
        this.bodyMakes = makes
      })
    }
}
