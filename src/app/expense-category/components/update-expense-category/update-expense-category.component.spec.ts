import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpenseCategoryComponent } from './update-expense-category.component';

describe('UpdateExpenseCategoryComponent', () => {
  let component: UpdateExpenseCategoryComponent;
  let fixture: ComponentFixture<UpdateExpenseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateExpenseCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateExpenseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
