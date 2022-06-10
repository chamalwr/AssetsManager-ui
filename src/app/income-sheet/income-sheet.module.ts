import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeSheetRoutingModule } from './income-sheet-routing.module';
import { IncomeSheetComponent } from './income-sheet.component';


@NgModule({
  declarations: [
    IncomeSheetComponent
  ],
  imports: [
    CommonModule,
    IncomeSheetRoutingModule
  ],
  exports: []
})
export class IncomeSheetModule { }
