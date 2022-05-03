import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseCategoryComponent } from './components/add-expense-category/add-expense-category.component';
import { UpdateExpenseCategoryComponent } from './components/update-expense-category/update-expense-category.component';
import { ExpenseCategoryComponent } from './expense-category.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseCategoryComponent,
  },
  {
    path: 'add-expense-category',
    component: AddExpenseCategoryComponent,
  },
  {
    path: 'update-expense-category',
    component: UpdateExpenseCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseCategoryRoutingModule { }
