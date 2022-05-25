import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IncomeCategoryService } from '../../income-category.service';

@Component({
  selector: 'amgr-update-income-category',
  templateUrl: './update-income-category.component.html',
  styleUrls: ['./update-income-category.component.scss']
})
export class UpdateIncomeCategoryComponent implements OnInit {
  updateIncomeCategoryForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(null)
  })
  constructor(private activeRoute: ActivatedRoute, 
              private route: Router ,private location: Location, 
              private incomeCategoryService: IncomeCategoryService,
              private readonly toastr: ToastrService,) { }
  
  incomeCategoryId: string = '';
  loading: boolean = false;
  userId: string = ''

  ngOnInit(): void {
    const routeData: any = this.location.getState()
    if(!routeData || !routeData._id){
      this.route.navigateByUrl('/income-category');
    }
    this.incomeCategoryId = routeData._id;
    this.getIncomeCategoryById(this.incomeCategoryId);
  }

  updateIncomeCategory() {
    if(this.updateIncomeCategoryForm.status === 'VALID'){
      const updateIncomeCategoryInput = {
        name: this.updateIncomeCategoryForm.value.name,
        description: this.updateIncomeCategoryForm.value.description,
      }
      
      this.incomeCategoryService.updateIncomeCategory(this.incomeCategoryId, updateIncomeCategoryInput).subscribe({
        next: (result: any) => {
          this.toastr.success(`${result.data.updateIncomeCategory.name} is updated`, 'Updated Income Category');
          this.route.navigateByUrl('/income-category');
        },
        error: (e) => {
          console.error(e);
          this.toastr.error('Something went wrong', 'Failed to update Income Category')
        }
      });
    }
  }

  getIncomeCategoryById(id: string){
    const data = this.incomeCategoryService.getIncomeCategoryById(id);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.incomeCategory && result.data.incomeCategory['__typename'] === 'IncomeCategory'){
            this.userId = result.data.incomeCategory.userId;
            this.updateIncomeCategoryForm.setValue({
              name: result.data.incomeCategory.name,
              description: result.data.incomeCategory.description,
            });
          }else if (result.data.incomeCategory && result.data.incomeCategory['__typename'] === 'IncomeCategoryResultError') {
            const errorModel = result.data.incomeCategory;
            this.toastr.warning(errorModel.message, 'Error');
            this.route.navigateByUrl('/income-category');
          }
          else{
            this.toastr.error('Cannot find Income Category to update', 'Error');
            this.route.navigateByUrl('/income-category');
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
