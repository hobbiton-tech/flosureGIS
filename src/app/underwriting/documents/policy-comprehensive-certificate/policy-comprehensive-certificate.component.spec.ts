import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyComprehensiveCertificateComponent } from './policy-comprehensive-certificate';

describe('PolicyComprehensiveCertificateComponent', () => {
  let component: PolicyComprehensiveCertificateComponent;
  let fixture: ComponentFixture<PolicyComprehensiveCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyComprehensiveCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyComprehensiveCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
