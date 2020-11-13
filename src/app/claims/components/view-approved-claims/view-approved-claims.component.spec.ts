import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovedClaimsComponent } from './view-approved-claims.component';

describe('ViewApprovedClaimsComponent', () => {
  let component: ViewApprovedClaimsComponent;
  let fixture: ComponentFixture<ViewApprovedClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApprovedClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovedClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
