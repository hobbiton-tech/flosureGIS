import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProgressTracker } from '../services/progress-tracker.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-quote-creation',
  templateUrl: './quote-creation.component.html',
  styleUrls: ['./quote-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuoteCreationComponent implements OnInit, AfterViewInit {
  progress$: Observable<number>;

  constructor(private progressTracker: ProgressTracker, private cdRef : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.progressTracker.upDateTracker(0);
    this.progress$ = this.progressTracker.currentValue;
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

}
