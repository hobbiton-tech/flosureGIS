import { Component, OnInit } from '@angular/core';
import { ProgressTracker } from '../../services/progress-tracker.service';

@Component({
  selector: 'app-policy-clauses',
  templateUrl: './policy-clauses.component.html',
  styleUrls: ['./policy-clauses.component.scss']
})
export class PolicyClausesComponent implements OnInit {


  constructor(private progressTracker: ProgressTracker) {
    this.progressTracker.upDateTracker(80);
   }

  ngOnInit(): void {
    this.progressTracker.upDateTracker(80);
  }

}
