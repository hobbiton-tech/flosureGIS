import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEngineeringRiskDetailsModel } from '../models/engineering-class/engineering-risk-details.model';

@Injectable({
    providedIn: 'root'
})
export class EngineeringClassService {
    constructor() {}

    // selected sub class
    selectedSubClass = new BehaviorSubject<string>('');

    // selected cover type
    selectedCoverType = new BehaviorSubject<string>('');

    // accident property details
    engineeringProductDetailsForm = new BehaviorSubject<
        IEngineeringRiskDetailsModel
    >(null);

    engineeringForm = new BehaviorSubject<IEngineeringRiskDetailsModel>(null);

    // observable streams
    selectedSubClassChanged$ = this.selectedSubClass.asObservable();
    selectedCoverTypeChanged$ = this.selectedCoverType.asObservable();
    engineeringProductDetailsChanged$ = this.engineeringProductDetailsForm.asObservable();

    engineeringFormChanged$ = this.engineeringForm.asObservable();

    // methods to change above observables
    changeSelectedSubClass(value: string) {
        this.selectedSubClass.next(value);
    }

    changeSelectedCoverType(value: string) {
        this.selectedCoverType.next(value);
    }

    changeEngineeringProductDetailsForm(value: IEngineeringRiskDetailsModel) {
        this.engineeringProductDetailsForm.next(value);
    }

    changeEngineeringForm(value: IEngineeringRiskDetailsModel) {
        this.engineeringForm.next(value);
    }

    getEngineeringProductDetails() {
        return this.engineeringProductDetailsForm.value;
    }

    getEngineeringFormDetails() {
        return this.engineeringForm.value;
    }
}
