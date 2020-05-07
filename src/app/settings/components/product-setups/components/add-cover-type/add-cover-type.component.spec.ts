import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoverTypeComponent } from './add-cover-type.component';

describe('AddCoverTypeComponent', () => {
  let component: AddCoverTypeComponent;
  let fixture: ComponentFixture<AddCoverTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCoverTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoverTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
