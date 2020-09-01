import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgnentBrokerStatementReportComponent } from './agnent-broker-statement-report.component';

describe('AgnentBrokerStatementReportComponent', () => {
  let component: AgnentBrokerStatementReportComponent;
  let fixture: ComponentFixture<AgnentBrokerStatementReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgnentBrokerStatementReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgnentBrokerStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
