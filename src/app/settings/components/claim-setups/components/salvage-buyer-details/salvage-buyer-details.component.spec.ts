import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvageBuyerDetailsComponent } from './salvage-buyer-details.component';

describe('SalvageBuyerDetailsComponent', () => {
  let component: SalvageBuyerDetailsComponent;
  let fixture: ComponentFixture<SalvageBuyerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvageBuyerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvageBuyerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
