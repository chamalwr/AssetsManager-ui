import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomeCategoryRoutingModule } from './income-category-routing.module';
import { IncomeCategoryComponent } from './income-category.component';


@NgModule({
  declarations: [
    IncomeCategoryComponent
  ],
  imports: [
    CommonModule,
    IncomeCategoryRoutingModule
  ],
  exports: [],
})
export class IncomeCategoryModule { }
