import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerilComponent } from './add-peril.component';

describe('AddPerilComponent', () => {
  let component: AddPerilComponent;
  let fixture: ComponentFixture<AddPerilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPerilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPerilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
