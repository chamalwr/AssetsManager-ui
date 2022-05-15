import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectedPeriodEntity } from './entity/selected-period.entity';
import { ViewType } from './enum/view-type.enum';
import { DateTime } from "luxon";
import { ExpenseCategoryService } from '../assests-manager-common/service/expense-category.service';
import { ExpenseCategory } from '../../app/assests-manager-common/entity/expense-category.entity';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'amgr-expense-sheet',
  templateUrl: './expense-sheet.component.html',
  styleUrls: ['./expense-sheet.component.scss']
})
export class ExpenseSheetComponent implements OnInit, OnChanges {
  
  currentView: ViewType = ViewType.SELECTED_VIEW;
  selectedPeriod: SelectedPeriodEntity;
  currentMonth: number;
  currentYear: number;
  deleteCurrentExpenseSheetButton: boolean = false;
  currentlySelectedExpenseSheet!: object;
  userId: string = environment.userId;
  userExpenseCategories: ExpenseCategory[] = [];
  loading: boolean = false;

  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly toastr: ToastrService,) {

    this.currentYear = DateTime.now().year;
    this.currentMonth = DateTime.now().month;

    this.selectedPeriod = {
      month: this.currentMonth,
      year: this.currentYear
    }
  }

  ngOnInit(): void {
    //Get All user Expense Categories
    if(this.userId){
      this.getExpenseCategories(this.userId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  changeToAllView(event: any){
    if(event && event === 'ALL_VIEW'){
      if(this.currentView === ViewType.SELECTED_VIEW){
        this.currentView = ViewType.ALL_VIEW
        this.deleteCurrentExpenseSheetButton = true;
      }
    }
  }

  changeToSelectedView(event: SelectedPeriodEntity){
    if(event){
      this.currentView = ViewType.SELECTED_VIEW;
      this.selectedPeriod = event;
      this.deleteCurrentExpenseSheetButton = false;
    }
  }

  disableDeleteButton(status: boolean){
    this.deleteCurrentExpenseSheetButton = status;
  }

  getCurrentlySelectedExpenseSheetDetail(event: any){
    if(event){
      this.currentlySelectedExpenseSheet = event;
    }
  }

  private getExpenseCategories(userId: string) {
    const data = this.expenseCategoryService.getAllExpenseCategories(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.expenseCategories && result.data.expenseCategories[0]['__typename'] === 'ExpenseCategory'){
            this.userExpenseCategories = result.data.expenseCategories;
            this.loading = false;
          }else if(result.data.expenseCategories && result.data.expenseCategories[0]['__typename'] === 'ExpenseCategoryResultError') {
            const errorModel = result.data.expenseCategories[0];
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.warning(`Something went wrong cannot fetch expense categories for current user`, 'Expense Category Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.warning(`Something went wrong cannot fetch expense categories for current user`, 'Expense Category Error');
      }
    });
  }

}
