import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyRevisionDetailsComponent } from './policy-revision-details.component';

describe('PolicyRevisionDetailsComponent', () => {
  let component: PolicyRevisionDetailsComponent;
  let fixture: ComponentFixture<PolicyRevisionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyRevisionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyRevisionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
