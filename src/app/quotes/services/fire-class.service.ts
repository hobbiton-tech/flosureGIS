import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PropertyDetailsModel } from '../models/fire-class/property-details.model';

@Injectable({
    providedIn: 'root'
})
export class FireClassService {
    constructor() {}

    // selected sub class
    selectedSubClass = new BehaviorSubject<string>('');

    // selected location
    selectedLocation = new BehaviorSubject<string>('');

    // selected roof type
    selectedRoofType = new BehaviorSubject<string>('');

    // selected use of building
    selectedUseOfBuilding = new BehaviorSubject<string>('');

    // selected cover type
    selectedCoverType = new BehaviorSubject<string>('');

    // selected risk category
    selectedRiskCategory = new BehaviorSubject<string>('');

    // property details form
    propertyDetailsForm = new BehaviorSubject<PropertyDetailsModel>(null);

    // observable streams
    selectedSubClassChanged$ = this.selectedSubClass.asObservable();
    selectedLocationChanged$ = this.selectedLocation.asObservable();
    selectedRoofTypeChanged$ = this.selectedRoofType.asObservable();
    selectedUseOfBuildingChanged$ = this.selectedUseOfBuilding.asObservable();
    selectedCoverTypeChanged$ = this.selectedCoverType.asObservable();
    selectedRiskCategoryChanged$ = this.selectedRiskCategory.asObservable();

    propertyDetailsChanged$ = this.propertyDetailsForm.asObservable();

    // method to change selected values
    changeSelectedSubClass(value: string) {
        this.selectedSubClass.next(value);
    }

    changeSelectedLocation(value: string) {
        this.selectedLocation.next(value);
    }

    changeSelectedRoofType(value: string) {
        this.selectedRoofType.next(value);
    }

    changeSelectedUseOfBuilding(value: string) {
        this.selectedUseOfBuilding.next(value);
    }

    changeSelectedCoverType(value: string) {
        this.selectedCoverType.next(value);
    }

    changeSelectedRiskCategory(value: string) {
        this.selectedRiskCategory.next(value);
    }

    changePropertyDetails(value: PropertyDetailsModel) {
        console.log('recieved prop dets:', value);
        this.propertyDetailsForm.next(value);
    }

    getPropertyDetails() {
        return this.propertyDetailsForm.value;
    }
}
