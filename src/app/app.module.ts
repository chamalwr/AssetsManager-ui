import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssestsManagerCommonModule } from './assests-manager-common/assests-manager-common.module';
import { IncomeCategoryModule } from './income-category/income-category.module';
import { IncomeSheetModule } from './income-sheet/income-sheet.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IncomeSheetModule,
    IncomeCategoryModule,
    AssestsManagerCommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
