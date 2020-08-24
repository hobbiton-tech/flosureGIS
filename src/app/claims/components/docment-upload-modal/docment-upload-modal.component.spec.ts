import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocmentUploadModalComponent } from './docment-upload-modal.component';

describe('DocmentUploadModalComponent', () => {
  let component: DocmentUploadModalComponent;
  let fixture: ComponentFixture<DocmentUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocmentUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocmentUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
