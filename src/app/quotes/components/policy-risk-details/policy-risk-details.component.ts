import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProgressTracker } from '../../services/progress-tracker.service';

@Component({
    selector: 'app-policy-risk-details',
    templateUrl: './policy-risk-details.component.html',
    styleUrls: ['./policy-risk-details.component.scss'],
})
export class PolicyRiskDetailsComponent implements OnInit {
    constructor(private progressTracker: ProgressTracker) {
        this.progressTracker.upDateTracker(40);
    }

    // ngAfterViewInit(): void {
    //   this.progressTracker.upDateTracker(40);
    // }

    ngOnInit(): void {
        this.progressTracker.upDateTracker(40);
    }
}
