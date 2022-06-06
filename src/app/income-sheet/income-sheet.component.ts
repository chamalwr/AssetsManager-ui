import { Component, OnInit } from '@angular/core';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IncomeCategory } from '../assests-manager-common/entity/income-category.entity';
import { IncomeCategoryService } from '../income-category/income-category.service';
import { SelectedPeriodEntity } from './entity/selected-period.entity';
import { ViewType } from './enum/view-type.enum';

@Component({
  selector: 'amgr-income-sheet',
  templateUrl: './income-sheet.component.html',
  styleUrls: ['./income-sheet.component.scss']
})
export class IncomeSheetComponent implements OnInit {

  currentView: ViewType = ViewType.SELECTED_VIEW;
  selectedPeriod: SelectedPeriodEntity;
  currentMonth: number;
  currentYear: number;
  deleteCurrentIncomeSheetButton: boolean = false;
  currentlySelectedIncomeSheet!: object;
  userId: string = environment.userId;
  userIncomeCategories: IncomeCategory[] = [];
  loading: boolean = false;

  constructor(
    private readonly incomeCategoryService: IncomeCategoryService,
    private readonly toastr: ToastrService
  ) {
    this.currentYear = DateTime.now().year;
    this.currentMonth = DateTime.now().month;

    this.selectedPeriod = {
      month: this.currentMonth,
      year: this.currentYear
    }
  }

  ngOnInit(): void {
       //Get All user Income Categories
       if(this.userId){
        this.getIncomeCategories(this.userId);
      }
  }

  changeToAllView(event: any){
    if(event && event === 'ALL_VIEW'){
      if(this.currentView === ViewType.SELECTED_VIEW){
        this.currentView = ViewType.ALL_VIEW
        this.deleteCurrentIncomeSheetButton = true;
      }
    }
  }

  changeToSelectedView(event: SelectedPeriodEntity){
    if(event){
      this.currentView = ViewType.SELECTED_VIEW;
      this.selectedPeriod = event;
      this.deleteCurrentIncomeSheetButton = false;
    }
  }

  disableDeleteButton(status: boolean){
    this.deleteCurrentIncomeSheetButton = status;
  }

  getCurrentlySelectedIncomeSheetDetail(event: any){
    if(event){
      this.currentlySelectedIncomeSheet = event;
      this.changeToSelectedView({ year: event.year, month: event.month })
    }
  }

  private getIncomeCategories(userId: string) {
    const data = this.incomeCategoryService.getAllIncomeCategories(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.incomeCategories && result.data.incomeCategories[0]['__typename'] === 'IncomeCategory'){
            this.userIncomeCategories = result.data.incomeCategories;
            this.loading = false;
          }else if(result.data.incomeCategories && result.data.incomeCategories[0]['__typename'] === 'IncomeCategoryResultError') {
            const errorModel = result.data.incomeCategories[0];
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.warning(`Something went wrong cannot fetch income categories for current user`, 'Income Category Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.warning(`Something went wrong cannot fetch income categories for current user`, 'Income Category Error');
      }
    });
  }
}
