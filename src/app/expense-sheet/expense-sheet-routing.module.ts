import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseSheetComponent } from './components/add-expense-sheet/add-expense-sheet.component';
import { ExpenseSheetComponent } from './expense-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseSheetComponent,
    pathMatch: 'full'
  },
  {
    path: 'add-expense-sheet',
    component: AddExpenseSheetComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseSheetRoutingModule { }
