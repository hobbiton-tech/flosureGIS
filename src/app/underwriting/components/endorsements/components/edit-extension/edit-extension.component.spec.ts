import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExtensionComponent } from './edit-extension.component';

describe('EditExtensionComponent', () => {
  let component: EditExtensionComponent;
  let fixture: ComponentFixture<EditExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
