import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IncomeCategoryService } from '../../income-category.service';

@Component({
  selector: 'amgr-add-income-category',
  templateUrl: './add-income-category.component.html',
  styleUrls: ['./add-income-category.component.scss']
})
export class AddIncomeCategoryComponent implements OnInit {
  
  createIncomeCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null)
  })
  
  constructor(
              private readonly incomeCategoryService: IncomeCategoryService,
              private readonly toastr: ToastrService,
              private readonly route: Router,
            ) { }

  ngOnInit(): void {
  }

  createIncomeCategory(){
    let userId = "chamalwr";
    if(this.createIncomeCategoryForm.status === 'VALID'){
      const createIncomeCategoryInput = {
        name: this.createIncomeCategoryForm.value.name,
        description: this.createIncomeCategoryForm.value.description,
        userId: userId,
      }
      
      this.incomeCategoryService.createIncomeCategory(createIncomeCategoryInput).subscribe({
        next: (result: any) => {
          this.toastr.success(`${result.data.createIncomeCategory.name} is created`, 'Created Income Category');
          this.route.navigateByUrl('/income-category');
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('Something went wrong', 'Failed to created Income Category')
        }
      });
    }
  }

}
