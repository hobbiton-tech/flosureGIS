import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarineProductDetailsComponent } from './marine-product-details.component';

describe('MarineProductDetailsComponent', () => {
  let component: MarineProductDetailsComponent;
  let fixture: ComponentFixture<MarineProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarineProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarineProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
