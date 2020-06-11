import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyCancellationDetailsComponent } from './policy-cancellation-details.component';

describe('PolicyCancellationDetailsComponent', () => {
  let component: PolicyCancellationDetailsComponent;
  let fixture: ComponentFixture<PolicyCancellationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyCancellationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyCancellationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
