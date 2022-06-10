import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssestsManagerCommonRoutingModule } from './assests-manager-common-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    AssestsManagerCommonRoutingModule
  ]
})
export class AssestsManagerCommonModule { }
