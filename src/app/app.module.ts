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
import { ExpenseCategoryComponent } from './expense-category/expense-category.component';
import { APOLLO_FLAGS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    AssestsManagerCommonModule,
    IncomeSheetModule,
    IncomeCategoryModule,
    ToastrModule.forRoot({
      timeOut: 8000,
      extendedTimeOut: 1000,
      easeTime: 300,
    }),
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APOLLO_FLAGS,
      useValue: {
        useInitialLoading: true,
      },
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.graphqlServerAWS,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
