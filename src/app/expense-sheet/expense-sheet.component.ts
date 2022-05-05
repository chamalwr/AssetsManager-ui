import { Component, OnInit } from '@angular/core';
import { ViewType } from './enum/view-type.enum';

@Component({
  selector: 'amgr-expense-sheet',
  templateUrl: './expense-sheet.component.html',
  styleUrls: ['./expense-sheet.component.scss']
})
export class ExpenseSheetComponent implements OnInit {
  
  currentView: ViewType = ViewType.ALL_VIEW;

  constructor() { }

  ngOnInit(): void {
  }

}
