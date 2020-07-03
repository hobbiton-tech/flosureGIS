import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountTypeComponent } from './discount-type.component';

describe('DiscountTypeComponent', () => {
  let component: DiscountTypeComponent;
  let fixture: ComponentFixture<DiscountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
