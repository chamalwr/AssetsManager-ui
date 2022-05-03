import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddIncomeCategoryComponent } from './components/add-income-category/add-income-category.component';
import { UpdateIncomeCategoryComponent } from './components/update-income-category/update-income-category.component';
import { IncomeCategoryComponent } from './income-category.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeCategoryComponent,
  },
  {
    path: 'add-income-category',
    component: AddIncomeCategoryComponent,
  },
  {
    path: 'update-income-category',
    component: UpdateIncomeCategoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeCategoryRoutingModule { }
