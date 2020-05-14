import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyExtensionDetailsComponent } from './policy-extension-details.component';

describe('PolicyExtensionDetailsComponent', () => {
  let component: PolicyExtensionDetailsComponent;
  let fixture: ComponentFixture<PolicyExtensionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyExtensionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyExtensionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
