import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IProduct, IClass } from '../models/product-setups-models.model';

@Injectable({
    providedIn: 'root'
})
export class ProductTrackerService {
    private classSource = new BehaviorSubject<IClass>(null);
    public currentClass$ = this.classSource.asObservable();

    changeClass(trackedClass: IClass) {
        this.classSource.next(trackedClass);
    }
}
