import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomeSheetComponent } from './income-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeSheetComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeSheetRoutingModule { }
