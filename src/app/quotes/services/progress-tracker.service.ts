import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProgressTracker {
    private trackerSource = new BehaviorSubject<number>(20);
    public currentValue = this.trackerSource.asObservable();

    public upDateTracker(value: number) {
        this.trackerSource.next(value);
    }
}