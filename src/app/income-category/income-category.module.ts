import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { IncomeCategoryRoutingModule } from './income-category-routing.module';
import { IncomeCategoryComponent } from './income-category.component';


@NgModule({
  declarations: [
    IncomeCategoryComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    IncomeCategoryRoutingModule
  ],
  exports: [],
})
export class IncomeCategoryModule { }
