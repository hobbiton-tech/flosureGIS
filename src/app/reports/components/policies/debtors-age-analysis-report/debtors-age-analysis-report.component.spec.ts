import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtorsAgeAnalysisReportComponent } from './debtors-age-analysis-report.component';

describe('DebtorsAgeAnalysisReportComponent', () => {
  let component: DebtorsAgeAnalysisReportComponent;
  let fixture: ComponentFixture<DebtorsAgeAnalysisReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebtorsAgeAnalysisReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtorsAgeAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
