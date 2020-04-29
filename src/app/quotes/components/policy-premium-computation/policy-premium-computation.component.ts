import { Component, OnInit } from '@angular/core';
import { ProgressTracker } from '../../services/progress-tracker.service';

@Component({
    selector: 'app-policy-premium-computation',
    templateUrl: './policy-premium-computation.component.html',
    styleUrls: ['./policy-premium-computation.component.scss'],
})
export class PolicyPremiumComputationComponent implements OnInit {
    constructor(private progressTracker: ProgressTracker) {
        this.progressTracker.upDateTracker(60);
    }

    ngOnInit(): void {
        this.progressTracker.upDateTracker(60);
    }
}
