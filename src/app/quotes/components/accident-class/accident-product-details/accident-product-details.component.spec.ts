import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentProductDetailsComponent } from './accident-product-details.component';

describe('AccidentProductDetailsComponent', () => {
  let component: AccidentProductDetailsComponent;
  let fixture: ComponentFixture<AccidentProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
