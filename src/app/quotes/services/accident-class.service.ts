import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAccidentRiskDetailsModel } from '../models/accident-class/accident-risk-details.model';

@Injectable({
    providedIn: 'root'
})
export class AccidentClassService {
    constructor() {}

    // selected sub class
    selectedSubClass = new BehaviorSubject<string>('');

    // selected cover type
    selectedCoverType = new BehaviorSubject<string>('');

    // accident property details
    accidentProductDetailsForm = new BehaviorSubject<IAccidentRiskDetailsModel>(
        null
    );

    // observable streams
    selectedSubClassChanged$ = this.selectedSubClass.asObservable();
    selectedCoverTypeChanged$ = this.selectedCoverType.asObservable();
    accidentProductDetailsChanged$ = this.accidentProductDetailsForm.asObservable();

    // methods to change above observables
    changeSelectedSubClass(value: string) {
        this.selectedSubClass.next(value);
    }

    changeSelectedCoverType(value: string) {
        this.selectedCoverType.next(value);
    }

    changeAccidentProductDetailsForm(value: IAccidentRiskDetailsModel) {
        this.accidentProductDetailsForm.next(value);
    }

    getAccidentProductDetails() {
        return this.accidentProductDetailsForm.value;
    }
}
