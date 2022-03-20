import { Component, OnInit } from '@angular/core';
import { IncomeCategoryService } from './income-category.service';

@Component({
  selector: 'amgr-income-category',
  templateUrl: './income-category.component.html',
  styleUrls: ['./income-category.component.scss']
})
export class IncomeCategoryComponent implements OnInit {

  constructor(private readonly incomeCategoryService: IncomeCategoryService) { }

  ngOnInit(): void {
  }

  getIncomeCategoryById(id: string){
    this.incomeCategoryService.getIncomeCategoryById(id);
  }

  getAllIncomeCategories(userId: string){
    this.incomeCategoryService.getAllIncomeCategories(userId);
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
