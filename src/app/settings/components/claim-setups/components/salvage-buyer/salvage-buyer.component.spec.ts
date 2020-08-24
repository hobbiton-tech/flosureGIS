import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalvageBuyerComponent } from './salvage-buyer.component';

describe('SalvageBuyerComponent', () => {
  let component: SalvageBuyerComponent;
  let fixture: ComponentFixture<SalvageBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalvageBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalvageBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
