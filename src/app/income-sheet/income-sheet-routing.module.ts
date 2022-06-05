import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIncomeSheetComponent } from './components/add-income-sheet/add-income-sheet.component';
import { IncomeSheetComponent } from './income-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeSheetComponent,
    pathMatch: 'full',
  },
  {
    path: 'add-income-sheet',
    component: AddIncomeSheetComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeSheetRoutingModule { }
