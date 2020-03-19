import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompaniesComponent } from './insurance-companies.component';

describe('InsuranceCompaniesComponent', () => {
  let component: InsuranceCompaniesComponent;
  let fixture: ComponentFixture<InsuranceCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
