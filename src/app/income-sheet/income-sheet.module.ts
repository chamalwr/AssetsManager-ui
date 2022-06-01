import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeSheetRoutingModule } from './income-sheet-routing.module';
import { IncomeSheetComponent } from './income-sheet.component';
import { AddIncomeSheetComponent } from './components/add-income-sheet/add-income-sheet.component';
import { IncomeSheetActionsComponent } from './components/income-sheet-actions/income-sheet-actions.component';
import { IncomeSheetAllViewComponent } from './components/income-sheet-all-view/income-sheet-all-view.component';
import { IncomeSheetSearchComponent } from './components/income-sheet-search/income-sheet-search.component';
import { IncomeSheetSelectedViewComponent } from './components/income-sheet-selected-view/income-sheet-selected-view.component';


@NgModule({
  declarations: [
    IncomeSheetComponent,
    AddIncomeSheetComponent,
    IncomeSheetActionsComponent,
    IncomeSheetAllViewComponent,
    IncomeSheetSearchComponent,
    IncomeSheetSelectedViewComponent
  ],
  imports: [
    CommonModule,
    IncomeSheetRoutingModule
  ],
  exports: []
})
export class IncomeSheetModule { }
