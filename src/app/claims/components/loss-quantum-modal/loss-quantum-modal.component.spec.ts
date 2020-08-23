import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LossQuantumModalComponent } from './loss-quantum-modal.component';

describe('LossQuantumModalComponent', () => {
  let component: LossQuantumModalComponent;
  let fixture: ComponentFixture<LossQuantumModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LossQuantumModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LossQuantumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
