import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SelectedPeriodEntity } from '../../entity/selected-period.entity';

@Component({
  selector: 'amgr-expense-sheet-search',
  templateUrl: './expense-sheet-search.component.html',
  styleUrls: ['./expense-sheet-search.component.scss']
})
export class ExpenseSheetSearchComponent implements OnInit, OnChanges {

  calenderModel!: NgbDateStruct;
  @Output() selectedMonthAndYearEvent = new EventEmitter<SelectedPeriodEntity>();
  @Output() switchViewEvent = new EventEmitter<string>();

  constructor(private calendar: NgbCalendar, private readonly toastr: ToastrService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  selectToday() {
    this.calenderModel = this.calendar.getToday();
  }

  search(){
    if(!this.calenderModel){
      this.toastr.warning(`Select Year and Month to Search from`, 'User Error');
    }else{
      const selectedMonth = this.calenderModel.month;
      const selectedYear = this.calenderModel.year;
      this.selectedMonthAndYearEvent.emit({ month: selectedMonth, year: selectedYear });
    }
  }

  getAllView(viewName: string){
    this.switchViewEvent.emit(viewName);
  }
}
