import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCancellationRiskComponent } from './view-cancellation-risk.component';

describe('ViewCancellationRiskComponent', () => {
  let component: ViewCancellationRiskComponent;
  let fixture: ComponentFixture<ViewCancellationRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCancellationRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCancellationRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
