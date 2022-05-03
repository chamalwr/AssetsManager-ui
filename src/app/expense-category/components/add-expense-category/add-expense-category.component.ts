import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseCategoryService } from '../../expense-category.service';

@Component({
  selector: 'amgr-add-expense-category',
  templateUrl: './add-expense-category.component.html',
  styleUrls: ['./add-expense-category.component.scss']
})
export class AddExpenseCategoryComponent implements OnInit {

  createExpenseCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null)
  })

  constructor(
              private readonly expenseCategoryService: ExpenseCategoryService,
              private readonly toastr: ToastrService,
              private readonly route: Router,
  ) { }

  ngOnInit(): void {
  }

  createExpenseCategory(){
    let userId = "johnDoe";
    if(this.createExpenseCategoryForm.status === 'VALID'){
      const createExpenseCategoryInput = {
        name: this.createExpenseCategoryForm.value.name,
        description: this.createExpenseCategoryForm.value.description,
        userId: userId,
      }
      
      this.expenseCategoryService.createExpenseCategory(createExpenseCategoryInput).subscribe({
        next: (result: any) => {
          this.toastr.success(`${result.data.createExpenseCategory.name} is created`, 'Created Expense Category');
          this.route.navigateByUrl('/expense-category');
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('Something went wrong', 'Failed to created Expense Category')
        }
      });
    }
  }

}
