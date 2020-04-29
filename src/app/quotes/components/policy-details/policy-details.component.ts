import { Component, OnInit } from '@angular/core';
import { ProgressTracker } from '../../services/progress-tracker.service';

@Component({
    selector: 'app-policy-details',
    templateUrl: './policy-details.component.html',
    styleUrls: ['./policy-details.component.scss'],
})
export class PolicyDetailsComponent implements OnInit {
    constructor(private progressTracker: ProgressTracker) {
        this.progressTracker.upDateTracker(20);
    }

    ngOnInit(): void {
        this.progressTracker.upDateTracker(20);
    }
}
