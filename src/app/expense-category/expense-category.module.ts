import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseCategoryRoutingModule } from './expense-category-routing.module';
import { AddExpenseCategoryComponent } from './components/add-expense-category/add-expense-category.component';
import { UpdateExpenseCategoryComponent } from './components/update-expense-category/update-expense-category.component';


@NgModule({
  declarations: [
    AddExpenseCategoryComponent,
    UpdateExpenseCategoryComponent
  ],
  imports: [
    CommonModule,
    ExpenseCategoryRoutingModule
  ]
})
export class ExpenseCategoryModule { }
