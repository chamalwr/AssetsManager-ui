import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'income-sheet',
    loadChildren: ()=> import('./income-sheet/income-sheet.module').then(m => m.IncomeSheetModule)
  },
  { 
    path: 'income-category',
    loadChildren: ()=> import('./income-category/income-category.module').then(m => m.IncomeCategoryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
