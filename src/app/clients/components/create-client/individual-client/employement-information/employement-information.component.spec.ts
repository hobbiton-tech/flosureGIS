import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployementInformationComponent } from './employement-information.component';

describe('EmployementInformationComponent', () => {
  let component: EmployementInformationComponent;
  let fixture: ComponentFixture<EmployementInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployementInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployementInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
