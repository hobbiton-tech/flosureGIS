import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessesComponent } from './excesses.component';

describe('ExcessesComponent', () => {
  let component: ExcessesComponent;
  let fixture: ComponentFixture<ExcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
