import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductCommissionComponent } from './add-product-commission.component';

describe('AddProductCommissionComponent', () => {
  let component: AddProductCommissionComponent;
  let fixture: ComponentFixture<AddProductCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
