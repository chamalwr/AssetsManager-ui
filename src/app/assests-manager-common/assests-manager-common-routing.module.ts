import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ExpenseSheetService } from './service/expense-sheet.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ExpenseSheetService]
})
export class AssestsManagerCommonRoutingModule { }
