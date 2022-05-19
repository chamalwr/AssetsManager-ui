import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'amgr-add-expense-sheet',
  templateUrl: './add-expense-sheet.component.html',
  styleUrls: ['./add-expense-sheet.component.scss']
})
export class AddExpenseSheetComponent implements OnInit, OnDestroy {
  
  calenderModel!: NgbDateStruct;

  temporyExpenseRecords: [] = [];
  temporyExpenseSheetDetails = {};

  constructor(private calendar: NgbCalendar, ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  selectToday() {
    this.calenderModel = this.calendar.getToday();
  }

}
