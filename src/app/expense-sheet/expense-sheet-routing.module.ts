import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseSheetComponent } from './expense-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseSheetComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseSheetRoutingModule { }
