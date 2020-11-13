import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageTypeComponent } from './damage-type.component';

describe('DamageTypeComponent', () => {
  let component: DamageTypeComponent;
  let fixture: ComponentFixture<DamageTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
