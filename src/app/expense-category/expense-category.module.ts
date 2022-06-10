import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseCategoryRoutingModule } from './expense-category-routing.module';
import { AddExpenseCategoryComponent } from './components/add-expense-category/add-expense-category.component';
import { UpdateExpenseCategoryComponent } from './components/update-expense-category/update-expense-category.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddExpenseCategoryComponent,
    UpdateExpenseCategoryComponent
  ],
  imports: [
    CommonModule,
    ExpenseCategoryRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExpenseCategoryModule { }
