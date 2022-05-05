import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'amgr-expense-sheet-search',
  templateUrl: './expense-sheet-search.component.html',
  styleUrls: ['./expense-sheet-search.component.scss']
})
export class ExpenseSheetSearchComponent implements OnInit {

  calenderModel!: NgbDateStruct;
  
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
      console.log(`User selected ${selectedMonth} Month and ${selectedYear} as year`);
    }
  }

  getAll(){
    //show new component and view all the expense sheets to userid on the same page itself
  }
}
