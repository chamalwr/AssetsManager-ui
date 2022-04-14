import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IncomeCategoryService } from './income-category.service';

@Component({
  selector: 'amgr-income-category',
  templateUrl: './income-category.component.html',
  styleUrls: ['./income-category.component.scss']
})
export class IncomeCategoryComponent implements OnInit {

  constructor(private readonly incomeCategoryService: IncomeCategoryService) { }
  loading: boolean = true;
  incomeCategories: any[] = [];

  ngOnInit(): void {
    this.getAllIncomeCategories('chamalwr');
  }

  getIncomeCategoryById(id: string){
    this.incomeCategoryService.getIncomeCategoryById(id);
  }

  getAllIncomeCategories(userId: string){
    const data = this.incomeCategoryService.getAllIncomeCategories(userId);
    data.subscribe(({ data, loading }) => {
        if(loading === true){
          this.loading = true;
        }else {
          console.log(data);
          if(data.incomeCategories && data.incomeCategories[0]['__typename'] === 'IncomeCategory'){
            this.incomeCategories = data.incomeCategories;
            this.loading = false;
          }else if (data.incomeCategories && data.incomeCategories[0]['__typename'] === 'IncomeCategoryResultError'){
            
            this.loading = false;
          }else{

          }
        }
    });
  }

  removeIncomeCategory(id: string){
    this.incomeCategoryService.removeIncomeCategory(id);
  }

  updateIncomeCategory(id: string, updateIncomeCategoryInput: any){
    this.incomeCategoryService.updateIncomeCategory(id, updateIncomeCategoryInput);
  }

  createIncomeCategory(createIncomeCategoryInput: any){
    this.incomeCategoryService.createIncomeCategory(createIncomeCategoryInput);
  }

}
