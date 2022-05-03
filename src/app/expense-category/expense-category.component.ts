import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseCategoryService } from './expense-category.service';

@Component({
  selector: 'amgr-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.scss']
})
export class ExpenseCategoryComponent implements OnInit {
  
  loading: boolean = true;
  expenseCategories: any[] = [];
  
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly toastr: ToastrService,
    private readonly route: Router,) { }
  
  ngOnInit(): void {
    this.getAllExpenseCategories("johnDoe");
  }

  getAllExpenseCategories(userId: string){
    const data = this.expenseCategoryService.getAllExpenseCategories(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.expenseCategories && result.data.expenseCategories[0]['__typename'] === 'ExpenseCategory'){
            this.expenseCategories = result.data.expenseCategories;
            this.loading = false;
          }else if (result.data.expenseCategories && result.data.expenseCategories['__typename'] === 'ExpenseCategoryResultError') {
            const errorModel = result.data.expenseCategories[0];
            this.toastr.warning(errorModel.message, 'Oops!')
            this.loading = false;
          }
          else{
            this.loading = false;
            this.toastr.error('Something went wrong!', 'Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Something went wrong!', 'Expense Categories Fetching Failed');
      },
    });
  }

  getExpenseCategoryById(id: string){
    const data = this.expenseCategoryService.getExpenseCategoryById(id);
  }

  removeExpenseCategory(id: string){
    const data = this.expenseCategoryService.removeExpenseCategory(id);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeExpenseCategory && result.data.removeExpenseCategory['__typename'] === 'ExpenseCategory'){
            this.loading = false;
            this.toastr.success(`Expense Category ${result.data.removeExpenseCategory.name} is deleted`, 'Expense category deleted')
            window.location.reload();
          }else if (result.data.expenseCategories && result.data.expenseCategories['__typename'] === 'ExpenseCategoryResultError') {
            this.loading = false;
            const errorModel = result.data.removeExpenseCategory;
            this.toastr.warning(errorModel.message, 'Error');
          }
          else{
            this.loading = false;
            this.toastr.error('Something went wrong!', 'Error');
          }
        }
      }
    });
  }

  createExpenseCategory(){
    this.route.navigateByUrl('/expense-category/add-expense-category')
  }

  updateExpenseCategory(id: string){
    this.route.navigateByUrl('/expense-category/update-expense-category', { state: { _id: id } });
  }
}
