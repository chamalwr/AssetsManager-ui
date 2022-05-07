import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectedPeriodEntity } from './entity/selected-period.entity';
import { ViewType } from './enum/view-type.enum';
import { DateTime } from "luxon";

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

  constructor() {
    this.currentYear = DateTime.now().year;
    this.currentMonth = DateTime.now().month;

    this.selectedPeriod = {
      month: this.currentMonth,
      year: this.currentYear
    }
   }

  ngOnInit(): void {
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

}
