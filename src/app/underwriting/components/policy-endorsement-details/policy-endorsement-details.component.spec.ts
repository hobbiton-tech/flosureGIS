import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyEndorsementDetailsComponent } from './policy-endorsement-details.component';

describe('PolicyEndorsementDetailsComponent', () => {
  let component: PolicyEndorsementDetailsComponent;
  let fixture: ComponentFixture<PolicyEndorsementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyEndorsementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyEndorsementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
