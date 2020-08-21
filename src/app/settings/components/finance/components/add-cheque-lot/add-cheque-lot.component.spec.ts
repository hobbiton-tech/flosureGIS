import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChequeLotComponent } from './add-cheque-lot.component';

describe('AddChequeLotComponent', () => {
  let component: AddChequeLotComponent;
  let fixture: ComponentFixture<AddChequeLotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChequeLotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChequeLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
