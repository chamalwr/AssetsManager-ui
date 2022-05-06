import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { ExpenseSheetRoutingModule } from './expense-sheet-routing.module';
import { ExpenseSheetComponent } from './expense-sheet.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseSheetSearchComponent } from './components/expense-sheet-search/expense-sheet-search.component';
import { ExpenseSheetActionsComponent } from './components/expense-sheet-actions/expense-sheet-actions.component';
import { NgbActiveModal, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseSheetAllViewComponent } from './components/expense-sheet-all-view/expense-sheet-all-view.component';
import { ExpenseSheetSelectedViewComponent } from './components/expense-sheet-selected-view/expense-sheet-selected-view.component';


@NgModule({
  declarations: [
    ExpenseSheetComponent,
    ExpenseSheetSearchComponent,
    ExpenseSheetActionsComponent,
    ExpenseSheetAllViewComponent,
    ExpenseSheetSelectedViewComponent
  ],
  imports: [
    CommonModule,
    ExpenseSheetRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModule,
  ],
  providers: [DecimalPipe, NgbActiveModal]
})
export class ExpenseSheetModule { }
