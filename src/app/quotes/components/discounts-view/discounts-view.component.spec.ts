import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsViewComponent } from './discounts-view.component';

describe('DiscountsViewComponent', () => {
  let component: DiscountsViewComponent;
  let fixture: ComponentFixture<DiscountsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
