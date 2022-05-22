import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: ()=> import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'income-sheet',
    loadChildren: ()=> import('./income-sheet/income-sheet.module').then(m => m.IncomeSheetModule)
  },
  { 
    path: 'income-category',
    loadChildren: ()=> import('./income-category/income-category.module').then(m => m.IncomeCategoryModule)
  },
  {
    path: 'expense-sheet',
    loadChildren: ()=> import('./expense-sheet/expense-sheet.module').then(m => m.ExpenseSheetModule)
  },
  {
    path: 'expense-category',
    loadChildren: ()=> import('./expense-category/expense-category.module').then(m => m.ExpenseCategoryModule)
  },
  {
    path: 'pageNotFound',
    loadChildren: ()=> import('./assests-manager-common/assests-manager-common.module').then(m => m.AssestsManagerCommonModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'pageNotFound'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
