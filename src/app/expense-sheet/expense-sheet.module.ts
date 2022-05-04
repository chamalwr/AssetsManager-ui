import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseSheetRoutingModule } from './expense-sheet-routing.module';
import { ExpenseSheetComponent } from './expense-sheet.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseSheetService } from './expense-sheet.service';


@NgModule({
  declarations: [
    ExpenseSheetComponent
  ],
  imports: [
    CommonModule,
    ExpenseSheetRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ExpenseSheetService]
})
export class ExpenseSheetModule { }
