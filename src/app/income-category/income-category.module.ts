import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { IncomeCategoryRoutingModule } from './income-category-routing.module';
import { IncomeCategoryComponent } from './income-category.component';
import { IncomeCategoryService } from './income-category.service';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS, APOLLO_FLAGS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { AddIncomeCategoryComponent } from './components/add-income-category/add-income-category.component';
import { UpdateIncomeCategoryComponent } from './components/update-income-category/update-income-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IncomeCategoryComponent,
    AddIncomeCategoryComponent,
    UpdateIncomeCategoryComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    IncomeCategoryRoutingModule,
    ApolloModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    IncomeCategoryService,
  ],
  exports: [],
})
export class IncomeCategoryModule { }
