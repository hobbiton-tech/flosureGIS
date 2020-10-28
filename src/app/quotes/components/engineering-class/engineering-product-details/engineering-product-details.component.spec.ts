import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringProductDetailsComponent } from './engineering-product-details.component';

describe('EngineeringProductDetailsComponent', () => {
  let component: EngineeringProductDetailsComponent;
  let fixture: ComponentFixture<EngineeringProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
