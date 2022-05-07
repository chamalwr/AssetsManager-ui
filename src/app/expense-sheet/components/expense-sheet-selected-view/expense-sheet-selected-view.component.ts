import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';
import { DateTime } from 'luxon';
import { ExpenseRecordSummary } from '../../entity/expense-sheet-summary.entity';

@Component({
  selector: 'amgr-expense-sheet-selected-view',
  templateUrl: './expense-sheet-selected-view.component.html',
  styleUrls: ['./expense-sheet-selected-view.component.scss']
})
export class ExpenseSheetSelectedViewComponent implements OnInit, OnChanges {

  @Input() selectedMonthAndYear: any;
  @Output() isDeleteSheetButtonDisabled = new EventEmitter<boolean>();
  @Output() currentExpenseSheetInfo = new EventEmitter<object>(); //use when need to delete current sheet and other info might useful in future

  expenseSheet: ExpenseRecordSummary = {
    month: 'N/A',
    year: 'N/A',
    totalAmount: '0.00',
    totalIncome: '0.00'
  };
  expenseRecords$: any[] = [];
  loading: boolean = false;
  userId: string = "chamalwr";
  currentSelectedMonth: number = DateTime.now().month;
  currentSelectedYear: number = DateTime.now().year;

  filter = new FormControl('');
  closeResult = "";

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    currencyPipe: CurrencyPipe,
    decimalPipe: DecimalPipe
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    //Change detected on Month and Year change
    if(changes['selectedMonthAndYear']){
      const changedValues = changes['selectedMonthAndYear'].currentValue;
      if(changedValues.month !== this.currentSelectedMonth || changedValues.year !== this.currentSelectedYear){
        this.getExpenseSheetForSelectedPeriod(this.userId, changedValues.month, changedValues.year, false);
      }
    }
  }

  ngOnInit(): void {
    if(this.selectedMonthAndYear){
      this.getExpenseSheetForSelectedPeriod(this.userId, this.selectedMonthAndYear.month, this.selectedMonthAndYear.year, true);
    }else {
      this.getExpenseSheetForSelectedPeriod(this.userId, DateTime.now().month, DateTime.now().year, true);
    }
  }

  getExpenseSheetForSelectedPeriod(userId: string, month: number, year: number, isFirstTime?: boolean){
    const data = this.expenseSheetService.getExpenseSheetsByMonthAndYear(userId, month, year);
    data.subscribe({
      next:(result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.expeseSheetByMonthAndYear && result.data.expeseSheetByMonthAndYear['__typename'] === 'ExpenseSheet'){
            this.expenseSheet = result.data.expeseSheetByMonthAndYear;
            //Setting expense sheet data to the binding property
            this.expenseSheet = {
              month: this.expenseSheet.month,
              year: this.expenseSheet.year,
              totalAmount: this.expenseSheet.totalAmount,
              totalIncome: '0.00'
            }
            this.expenseRecords$ = result.data.expeseSheetByMonthAndYear.expenseRecords;
            this.currentSelectedMonth = result.data.expeseSheetByMonthAndYear.month;
            this.currentSelectedYear = result.data.expeseSheetByMonthAndYear.year;
            this.loading = false;
          }else if(result.data.expeseSheetByMonthAndYear && result.data.expeseSheetByMonthAndYear['__typename'] === 'ExpenseSheetResultError'){
            if(isFirstTime){
              const errorModel = result.data.expeseSheetByMonthAndYear;
              this.loading = false;
              this.isDeleteSheetButtonDisabled.emit(true);
              this.toastr.warning(`Currently you don't have expense sheet created for this month`, errorModel.message);
            }else {
              const errorModel = result.data.expeseSheetByMonthAndYear;
              this.loading = false;
              this.isDeleteSheetButtonDisabled.emit(true);
              this.toastr.warning(errorModel.reason, errorModel.message);
            }
            //Reseting values
            this.expenseRecords$ = [];
            this.expenseSheet = {
              month: 'N/A',
              year: 'N/A',
              totalAmount: '0.00',
              totalIncome: '0.00'
            };
            this.currentSelectedMonth = month;
            this.currentSelectedYear = year;
          }else{
             //Reseting values
            this.expenseRecords$ = [];
            this.expenseSheet = {
              month: 'N/A',
              year: 'N/A',
              totalAmount: '0.00',
              totalIncome: '0.00'
            };
            this.currentSelectedMonth = month;
            this.currentSelectedYear = year;
            this.isDeleteSheetButtonDisabled.emit(true);
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot fetch Expense Sheet for selected month and year`, 'Error')
          }
        }
      },
      error: (e) => {
         //Reseting values
        this.expenseRecords$ = [];
        this.expenseSheet = {
          month: 'N/A',
          year: 'N/A',
          totalAmount: '0.00',
          totalIncome: '0.00'
        };
        this.currentSelectedMonth = month;
        this.currentSelectedYear = year;
        this.isDeleteSheetButtonDisabled.emit(false);
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot fetch Expense Sheet for selected month and year`, 'Error')
      }
    });
  }
}
