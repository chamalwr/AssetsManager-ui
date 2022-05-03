import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseCategoryService } from '../../expense-category.service';

@Component({
  selector: 'amgr-update-expense-category',
  templateUrl: './update-expense-category.component.html',
  styleUrls: ['./update-expense-category.component.scss']
})
export class UpdateExpenseCategoryComponent implements OnInit {

  updateExpenseCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null)
  })
  expenseCategoryId: string = '';
  loading: boolean = false;
  userId: string = ''

  constructor(private activeRoute: ActivatedRoute, 
              private route: Router ,
              private location: Location, 
              private expenseCategoryService: ExpenseCategoryService,
              private readonly toastr: ToastrService,) { }

  ngOnInit(): void {
    const routeData: any = this.location.getState()
    if(!routeData || !routeData._id){
      this.route.navigateByUrl('/expense-category');
    }
    this.expenseCategoryId = routeData._id;
    this.getExpenseCategoryById(this.expenseCategoryId);
  }

  updateExpenseCategory(){
    if(this.updateExpenseCategoryForm.status === 'VALID'){
      const updateExpenseCategoryInput = {
        name: this.updateExpenseCategoryForm.value.name,
        description: this.updateExpenseCategoryForm.value.description,
      }
      
      this.expenseCategoryService.updateExpenseCategory(this.expenseCategoryId, updateExpenseCategoryInput).subscribe({
        next: (result: any) => {
          this.toastr.success(`${result.data.updateExpenseCategory.name} is updated`, 'Updated Expense Category');
          this.route.navigateByUrl('/expense-category');
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('Something went wrong', 'Failed to update Expense Category')
        }
      });
    }
  }

  getExpenseCategoryById(expenseCategoryId: string) {
    const data = this.expenseCategoryService.getExpenseCategoryById(expenseCategoryId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.expenseCategory && result.data.expenseCategory['__typename'] === 'ExpenseCategory'){
            this.userId = result.data.expenseCategory.userId;
            this.updateExpenseCategoryForm.setValue({
              name: result.data.expenseCategory.name,
              description: result.data.expenseCategory.description,
            });
          }else if (result.data.expenseCategory && result.data.expenseCategory['__typename'] === 'ExpenseCategoryResultError') {
            const errorModel = result.data.expenseCategory;
            this.toastr.warning(errorModel.message, 'Error');
            this.route.navigateByUrl('/expense-category');
          }
          else{
            this.toastr.error('Cannot find Expense Category to update', 'Error');
            this.route.navigateByUrl('/expense-category');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Something went wrong!', 'Error');
      },
    });
  }

}
