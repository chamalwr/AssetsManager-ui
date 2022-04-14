import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IncomeCategoryService } from './income-category.service';

@Component({
  selector: 'amgr-income-category',
  templateUrl: './income-category.component.html',
  styleUrls: ['./income-category.component.scss']
})
export class IncomeCategoryComponent implements OnInit {

  constructor(private readonly incomeCategoryService: IncomeCategoryService,
              private readonly toastr: ToastrService,
              private readonly changeDetectorRefs: ChangeDetectorRef) { }
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
        if(loading){
          this.loading = true;
        }else {
          if(data.incomeCategories && data.incomeCategories[0]['__typename'] === 'IncomeCategory'){
            this.incomeCategories = data.incomeCategories;
            this.loading = false;
          }else if (data.incomeCategories && data.incomeCategories[0]['__typename'] === 'IncomeCategoryResultError'){
            const errorModel = data.incomeCategories[0];
            this.toastr.warning(errorModel.message, 'Oops!')
            this.loading = false;
          }else{
            this.loading = false;
            this.toastr.error('Something went wrong!', 'Error');
          }
        }
    });
  }

  removeIncomeCategory(id: string){
    const result = this.incomeCategoryService.removeIncomeCategory(id);
    result.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeIncomeCategory && result.data.removeIncomeCategory['__typename'] === 'IncomeCategory'){
            this.loading = false;
            this.toastr.success(`Income Category ${result.data.removeIncomeCategory.name} is deleted`, 'Income category deleted')
          }else if (result.data.removeIncomeCategory && result.data.removeIncomeCategory['__typename'] === 'IncomeCategoryResultError') {
            this.loading = false;
            const errorModel = result.data.removeIncomeCategory;
            this.toastr.warning(errorModel.message, 'Error');
          }
          else{
            this.toastr.error('Delete did not completed', 'Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Something went wrong!', 'Delete Failed');
      },
    });
  }

  updateIncomeCategory(id: string, updateIncomeCategoryInput?: any){
    this.incomeCategoryService.updateIncomeCategory(id, updateIncomeCategoryInput);
  }

  createIncomeCategory(createIncomeCategoryInput: any){
    this.incomeCategoryService.createIncomeCategory(createIncomeCategoryInput);
  }

}
