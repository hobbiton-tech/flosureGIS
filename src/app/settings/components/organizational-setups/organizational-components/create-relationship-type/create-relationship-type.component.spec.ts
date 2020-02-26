import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRelationshipTypeComponent } from './create-relationship-type.component';

describe('CreateRelationshipTypeComponent', () => {
  let component: CreateRelationshipTypeComponent;
  let fixture: ComponentFixture<CreateRelationshipTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRelationshipTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRelationshipTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
