import { Injectable } from '@angular/core';
import { BodyType } from '../models/quote.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { VehicleDetailsModel } from '../models/vehicle-details.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleDetailsServiceService {
    constructor() {}

    // risk details editable
    isRiskEditMode = new BehaviorSubject<boolean>(false);

    // vehicle details
    vehicleMake = new BehaviorSubject('');
    vehicleModel = new BehaviorSubject('');
    yearOfManufacture = new BehaviorSubject('');
    regNumber = new BehaviorSubject('');
    engineNumber = new BehaviorSubject('');
    chassisNumber = new BehaviorSubject('');
    color = new BehaviorSubject('');
    cubicCapacity = new BehaviorSubject('');
    seatingCapacity = new BehaviorSubject('');
    bodyType = new BehaviorSubject<BodyType>('SUV');

    VehicleDetailsForm = new BehaviorSubject<VehicleDetailsModel>({});

    // Observable streams
    vehicleMakeChanged$ = this.vehicleMake.asObservable();
    vehicleModelChanged$ = this.vehicleModel.asObservable();
    yearOfManufactureChanged$ = this.yearOfManufacture.asObservable();
    regNumberChanged$ = this.yearOfManufacture.asObservable();
    engineNumberChanged$ = this.engineNumber.asObservable();
    chassisNumberChanged$ = this.chassisNumber.asObservable();
    colorChanged$ = this.color.asObservable();
    cubicCapacityChanged$ = this.cubicCapacity.asObservable();
    seatingCapacityChanged$ = this.seatingCapacity.asObservable();
    bodyTypeChanged$ = this.bodyType.asObservable();

    vehicleDetailsFormChanged$ = this.VehicleDetailsForm.asObservable();

    riskEditModeChanged$ = this.isRiskEditMode.asObservable();

    changeVehicleMake(value: string) {
        this.vehicleMake.next(value);
    }
    changeVehicleModel(value: string) {
        this.vehicleModel.next(value);
    }
    changeYearOfManufacture(value: string) {
        this.yearOfManufacture.next(value);
    }
    changeRegNumber(value: string) {
        this.regNumber.next(value);
    }
    changeEngineNumber(value: string) {
        this.engineNumber.next(value);
    }
    changeChassisNumber(value: string) {
        this.chassisNumber.next(value);
    }
    changeColor(value: string) {
        this.color.next(value);
    }
    changeCubicCapacity(value: string) {
        this.cubicCapacity.next(value);
    }
    changeSeatingCapacity(value: string) {
        this.seatingCapacity.next(value);
    }
    changeBodyType(value: BodyType) {
        this.bodyType.next(value);
    }

    changeVehicleDetails(value: VehicleDetailsModel) {
        this.VehicleDetailsForm.next(value);
    }

    changeRiskEditMode(value: boolean) {
        this.isRiskEditMode.next(value);
    }

    // gets vehicle details
    getVehicleDetails() {
      console.log('Vehicle Form>>>>', this.VehicleDetailsForm.value);
      return this.VehicleDetailsForm.value;
    }

    resetVehicleDetails() {
        const vehicleDetails: VehicleDetailsModel = {
            vehicleMake: null,
            vehicleModel: null,
            yearOfManufacture: null,
            regNumber: null,
            engineNumber: null,
            chassisNumber: null,
            color: null,
            cubicCapacity: null,
            seatingCapacity: null,
            bodyType: null
        };

        this.changeVehicleDetails(vehicleDetails);
    }
}
