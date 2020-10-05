import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';

@Injectable({
    providedIn: 'root'
})
export class InsuranceClassHandlerService {
    // selected class
    selectedClass = new BehaviorSubject<IClass>(null);

    // observable streams
    selectedClassChanged$ = this.selectedClass.asObservable();

    changeSelectedClass(value: IClass) {
        this.selectedClass.next(value);
        console.log('current class:=>', value);
        localStorage.setItem('class', value.className);
        localStorage.setItem('classObject', JSON.stringify(value));
    }
    constructor() {}
}
