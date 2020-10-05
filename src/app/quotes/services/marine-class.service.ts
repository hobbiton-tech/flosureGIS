import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMarineRiskDetailsModel } from '../models/marine-class/marine-risk-details.model';

@Injectable({
    providedIn: 'root'
})
export class MarineClassService {
    constructor() {}

    // selected sub class
    selectedSubClass = new BehaviorSubject<string>('');

    // selected cover type
    selectedCoverType = new BehaviorSubject<string>('');

    // accident property details
    marineProductDetailsForm = new BehaviorSubject<IMarineRiskDetailsModel>(
        null
    );

    marineForm = new BehaviorSubject<IMarineRiskDetailsModel>(null);

    // observable streams
    selectedSubClassChanged$ = this.selectedSubClass.asObservable();
    selectedCoverTypeChanged$ = this.selectedCoverType.asObservable();
    marineProductDetailsChanged$ = this.marineProductDetailsForm.asObservable();

    marineFormChanged$ = this.marineForm.asObservable();

    // methods to change above observables
    changeSelectedSubClass(value: string) {
        this.selectedSubClass.next(value);
    }

    changeSelectedCoverType(value: string) {
        this.selectedCoverType.next(value);
    }

    changeMarineProductDetailsForm(value: IMarineRiskDetailsModel) {
        this.marineProductDetailsForm.next(value);
    }

    changeMarineForm(value: IMarineRiskDetailsModel) {
        this.marineForm.next(value);
    }

    getMarineProductDetails() {
        return this.marineProductDetailsForm.value;
    }

    getMarineFormDetails() {
        return this.marineForm.value;
    }
}
