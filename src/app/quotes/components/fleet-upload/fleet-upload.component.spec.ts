import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetUploadComponent } from './fleet-upload.component';

describe('FleetUploadComponent', () => {
  let component: FleetUploadComponent;
  let fixture: ComponentFixture<FleetUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
