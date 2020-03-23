import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerilsComponent } from './perils.component';

describe('PerilsComponent', () => {
  let component: PerilsComponent;
  let fixture: ComponentFixture<PerilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
