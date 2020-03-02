import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientTypeComponent } from './create-client-type.component';

describe('CreateClientTypeComponent', () => {
  let component: CreateClientTypeComponent;
  let fixture: ComponentFixture<CreateClientTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClientTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClientTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
