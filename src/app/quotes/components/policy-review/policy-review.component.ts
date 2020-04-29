import { Component, OnInit } from '@angular/core';
import { ProgressTracker } from '../../services/progress-tracker.service';

@Component({
    selector: 'app-policy-review',
    templateUrl: './policy-review.component.html',
    styleUrls: ['./policy-review.component.scss'],
})
export class PolicyReviewComponent implements OnInit {
    constructor(private progressTracker: ProgressTracker) {
        this.progressTracker.upDateTracker(100);
    }

    ngOnInit(): void {
        this.progressTracker.upDateTracker(100);
    }
}
