import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
    accidentProductDetailsForm = new BehaviorSubject(null);
}
