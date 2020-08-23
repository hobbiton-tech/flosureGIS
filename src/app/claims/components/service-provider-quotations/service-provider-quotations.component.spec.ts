import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderQuotationsComponent } from './service-provider-quotations.component';

describe('ServiceProviderQuotationsComponent', () => {
  let component: ServiceProviderQuotationsComponent;
  let fixture: ComponentFixture<ServiceProviderQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceProviderQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceProviderQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
