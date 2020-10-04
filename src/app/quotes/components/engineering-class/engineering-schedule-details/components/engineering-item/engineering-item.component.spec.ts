import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineeringItemComponent } from './engineering-item.component';

describe('EngineeringItemComponent', () => {
  let component: EngineeringItemComponent;
  let fixture: ComponentFixture<EngineeringItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineeringItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
