import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssestsManagerCommonModule } from './assests-manager-common/assests-manager-common.module';
import { HomeModule } from './home/home.module';
import { IncomeCategoryModule } from './income-category/income-category.module';
import { IncomeSheetModule } from './income-sheet/income-sheet.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    AssestsManagerCommonModule,
    IncomeSheetModule,
    IncomeCategoryModule,
    ToastrModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
