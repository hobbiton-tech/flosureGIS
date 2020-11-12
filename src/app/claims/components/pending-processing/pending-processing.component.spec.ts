import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingProcessingComponent } from './pending-processing.component';

describe('PendingProcessingComponent', () => {
  let component: PendingProcessingComponent;
  let fixture: ComponentFixture<PendingProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
