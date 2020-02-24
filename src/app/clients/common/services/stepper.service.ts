import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StepperService {
    private valueSource = new BehaviorSubject<boolean>(false);
    showStepper$ = this.valueSource.asObservable();

    private stepperIndexSource = new BehaviorSubject<number>(0);
    currentStep$ = this.stepperIndexSource.asObservable();

    toggleStepper(value: boolean) {
        this.valueSource.next(value);
    }

    changeIndex(current: number) {
        this.stepperIndexSource.next(current);
    }

    constructor() {}
}
