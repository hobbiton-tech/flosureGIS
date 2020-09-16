import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceProviderQuoteComponent } from './add-service-provider-quote.component';

describe('AddServiceProviderQuoteComponent', () => {
  let component: AddServiceProviderQuoteComponent;
  let fixture: ComponentFixture<AddServiceProviderQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServiceProviderQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddServiceProviderQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
