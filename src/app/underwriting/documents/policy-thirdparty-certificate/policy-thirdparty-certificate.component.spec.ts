import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyThirdpartyCertificateComponent } from './policy-thirdparty-certificate.component';

describe('PolicyThirdpartyCertificateComponent', () => {
  let component: PolicyThirdpartyCertificateComponent;
  let fixture: ComponentFixture<PolicyThirdpartyCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyThirdpartyCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyThirdpartyCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
