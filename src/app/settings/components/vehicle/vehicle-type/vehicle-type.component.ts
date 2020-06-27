import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from '../../agents/services/agents.service';
import { NzMessageService } from 'ng-zorro-antd';
import { IAgent, IBroker, ISalesRepresentative } from '../../agents/models/agents.model';
import { VehicleService } from '../services/vehicle.service';
import { IVehicleType } from '../models/vehicle.model';


@Component({
    selector: 'app-vehicle-type',
    templateUrl: './vehicle-type.component.html',
    styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {

   //loading feedback
   addingVehicleType: boolean = false;

   @Input()
   isAddVehicleTypesFormDrawerVisible: boolean;

   @Output()
   closeAddVehicleTypesFormDrawerVisible: EventEmitter<any> = new EventEmitter();

   update: boolean = true;

   vehicleTypeForm: FormGroup;

   selectedIntermediaryType: string;

   constructor(
       private formBuilder: FormBuilder,
       private vehicleService: VehicleService,
       private msg: NzMessageService
   ) {
       //agent form
       this.vehicleTypeForm = this.formBuilder.group({

           vehicleType: ['', Validators.required],
           description: ['', Validators.required]
       });
   }

   ngOnInit(): void {

   }

   resetForm(e: MouseEvent): void {
       e.preventDefault();
       this.vehicleTypeForm.reset();
   }

   closeDrawer(): void {
       this.closeAddVehicleTypesFormDrawerVisible.emit(true);
   }

   async addVehicleType(vehicleType: IVehicleType) {
       this.addingVehicleType = true;
       await this.vehicleService.addVehicleType(vehicleType).subscribe(
           res => {
               this.msg.success('Vehicle Type added successfully')
               this.addingVehicleType = false;
               this.closeDrawer();
           },
           err => {
               this.msg.error('Failed to add Vehicle Type')
               this.addingVehicleType = false;
           }
       );
   }

   submitVehicleType() {
       for (let i in this.vehicleTypeForm.controls) {
           /// validation;
           this.vehicleTypeForm.controls[i].markAsDirty();
           this.vehicleTypeForm.controls[i].updateValueAndValidity();
       }

       if (this.vehicleTypeForm.valid || !this.vehicleTypeForm.valid) {
           this.addVehicleType(this.vehicleTypeForm.value).then(res => {
               this.vehicleTypeForm.reset();
           });
       }
   }
}
