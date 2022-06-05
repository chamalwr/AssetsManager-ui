import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SelectedPeriodEntity } from '../../entity/selected-period.entity';

@Component({
  selector: 'amgr-income-sheet-search',
  templateUrl: './income-sheet-search.component.html',
  styleUrls: ['./income-sheet-search.component.scss']
})
export class IncomeSheetSearchComponent implements OnInit {
  
  calenderModel!: NgbDateStruct;
  @Output() selectedMonthAndYearEvent = new EventEmitter<SelectedPeriodEntity>();
  @Output() switchViewEvent = new EventEmitter<string>();
  
  constructor(private calendar: NgbCalendar, private readonly toastr: ToastrService) { }

  ngOnInit(): void {
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
