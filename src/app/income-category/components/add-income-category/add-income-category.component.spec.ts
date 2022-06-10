import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncomeCategoryComponent } from './add-income-category.component';

describe('AddIncomeCategoryComponent', () => {
  let component: AddIncomeCategoryComponent;
  let fixture: ComponentFixture<AddIncomeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncomeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
