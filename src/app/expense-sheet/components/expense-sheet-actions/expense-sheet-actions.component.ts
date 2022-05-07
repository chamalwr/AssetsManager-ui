import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'amgr-expense-sheet-actions',
  templateUrl: './expense-sheet-actions.component.html',
  styleUrls: ['./expense-sheet-actions.component.scss']
})
export class ExpenseSheetActionsComponent implements OnInit, OnChanges {

  @Input() isDeleteCurrentSheetDisabled: boolean = false;

  constructor() { }
  

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  addNew(){

  }

  removeCurrentSheet(){
    
  }

}
