import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIncomeCategoryComponent } from './update-income-category.component';

describe('UpdateIncomeCategoryComponent', () => {
  let component: UpdateIncomeCategoryComponent;
  let fixture: ComponentFixture<UpdateIncomeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateIncomeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIncomeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
