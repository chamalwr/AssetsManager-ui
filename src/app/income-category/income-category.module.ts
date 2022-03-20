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


@NgModule({
  declarations: [
    IncomeCategoryComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    IncomeCategoryRoutingModule,
    ApolloModule,
    HttpClientModule,
  ],
  providers: [
    IncomeCategoryService,
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
            uri: 'http://localhost:3000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  exports: [],
})
export class IncomeCategoryModule { }
