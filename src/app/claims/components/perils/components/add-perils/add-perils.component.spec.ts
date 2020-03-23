import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerilsComponent } from './add-perils.component';

describe('AddPerilsComponent', () => {
  let component: AddPerilsComponent;
  let fixture: ComponentFixture<AddPerilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPerilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPerilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
