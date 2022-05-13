import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';
import { DateTime } from 'luxon';
import { ExpenseRecordSummary } from '../../entity/expense-sheet-summary.entity';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators'
import { ExpenseCategory } from '../../../../app/assests-manager-common/entity/expense-category.entity';
import { ExpenseCategoryService } from '../../../../app/assests-manager-common/service/expense-category.service';
import { ExpenseRecord } from 'src/app/assests-manager-common/entity/expense-record.entity';
import { ExpenseRecordsService } from 'src/app/assests-manager-common/service/expense-records.service';

type ExpenseRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-expense-sheet-selected-view',
  templateUrl: './expense-sheet-selected-view.component.html',
  styleUrls: ['./expense-sheet-selected-view.component.scss']
})
export class ExpenseSheetSelectedViewComponent implements OnInit, OnChanges {

  @Input() selectedMonthAndYear: any;
  @Output() isDeleteSheetButtonDisabled = new EventEmitter<boolean>();
  @Output() currentExpenseSheetInfo = new EventEmitter<object>();

  expenseSheet: ExpenseRecordSummary = {
    _id: '',
    month: 'N/A',
    year: 'N/A',
    totalAmount: '0.00',
    totalIncome: '0.00'
  };

  currentExpenseRecord: ExpenseRecord = {
    expenseRecordId: '',
    date: 0,
    notes: '',
    amount: 0.00,
    expenseCategoryId: '',
  };
  expenseRecords$: any[] = [];
  userExpenseCategories: ExpenseCategory[] = [];
  loading: boolean = false;
  userId: string = "chamalwr";
  currentSelectedMonth: number = DateTime.now().month;
  currentSelectedYear: number = DateTime.now().year;

  public model!: ExpenseRecordType;
  editProfileForm!: FormGroup;
  formatter = (state: ExpenseRecordType) => state.name;
  filter = new FormControl('');
  closeResult = "";

  constructor(
    private expenseSheetService: ExpenseSheetService,
    private expenseCategoryService: ExpenseCategoryService,
    private expenseRecordService: ExpenseRecordsService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    currencyPipe: CurrencyPipe,
    decimalPipe: DecimalPipe,
    private fb: FormBuilder
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
    //load all expense categories created by user
    if(this.userId){
      this.getExpenseCategories(this.userId);
    }

    //Load current month and years exense sheet
    if(this.selectedMonthAndYear){
      this.getExpenseSheetForSelectedPeriod(this.userId, this.selectedMonthAndYear.month, this.selectedMonthAndYear.year, true);
    }else {
      this.getExpenseSheetForSelectedPeriod(this.userId, DateTime.now().month, DateTime.now().year, true);
    }
  }

  openDeleteExpenseRecord(expenseSheetId: string, expenseRecordId: string, content: any){
    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
        console.log('Confirm Delete Operation')
        this.confirmExpenseRecordDeletion(expenseSheetId, expenseRecordId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditExpenseRecord(expenseRecord: any, content: any) {
    console.log(expenseRecord);
    this.currentExpenseRecord = { 
      expenseRecordId: expenseRecord._id,
      notes: expenseRecord.notes,
      amount: expenseRecord.amount,
      date: expenseRecord.date,
      expenseCategoryId: expenseRecord.expenseCategory._id,
    }
    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title', injector: expenseRecord})
    .result.then((result) => {
        console.log('Confirm Update Operation')
        this.confirmExpenseRecordUpdate(expenseRecord);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
              _id: this.expenseSheet._id,
              month: this.expenseSheet.month,
              year: this.expenseSheet.year,
              totalAmount: this.expenseSheet.totalAmount,
              totalIncome: '0.00'
            }
            this.expenseRecords$ = result.data.expeseSheetByMonthAndYear.expenseRecords;
            this.currentSelectedMonth = result.data.expeseSheetByMonthAndYear.month;
            this.currentSelectedYear = result.data.expeseSheetByMonthAndYear.year;
            this.loading = false;
            this.currentExpenseSheetInfo.emit({expenseSheetId: result.data.expeseSheetByMonthAndYear._id});
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
              _id: '',
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
              _id: '',
              month: 'N/A',
              year: 'N/A',
              totalAmount: '0.00',
              totalIncome: '0.00'
            };
            this.currentSelectedMonth = month;
            this.currentSelectedYear = year;
            this.isDeleteSheetButtonDisabled.emit(true);
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot fetch Expense Sheet for selected month and year`, 'Error');
          }
        }
      },
      error: (e) => {
         //Reseting values
        this.expenseRecords$ = [];
        this.expenseSheet = {
          _id: '',
          month: 'N/A',
          year: 'N/A',
          totalAmount: '0.00',
          totalIncome: '0.00'
        };
        this.currentSelectedMonth = month;
        this.currentSelectedYear = year;
        this.isDeleteSheetButtonDisabled.emit(false);
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot fetch Expense Sheet for selected month and year`, 'Error');
      }
    });
  }

  private confirmExpenseRecordDeletion(expenseSheetId: string, expenseRecordId: string){
    console.log(`Expense Sheet ID : ${expenseSheetId} and Expense Record Id : ${expenseRecordId}`);
    const data = this.expenseRecordService.removeExpenseRecord(expenseSheetId, expenseRecordId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeExpenseRecord && result.data.removeExpenseRecord['__typename'] === 'ExpenseRecord' || result.data.removeExpenseRecord['__typename'] === 'ExpenseSheet'){
            this.loading = false;
            this.toastr.success(`Expense record deleted`, 'Expense Record Deletion Success');
          }else if(result.data.removeExpenseRecord && result.data.removeExpenseRecord['__typename'] === 'ExpenseRecordResultError' ){
            const errorModel = result.data.removeExpenseRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.warning('Cannot delete selected expense record', 'Expense Record Deletion Failed');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.warning('Cannot delete selected expense record', 'Expense Record Deletion Failed')
      }
    });
  }

  private confirmExpenseRecordUpdate(expenseRecord: any){
    console.log(expenseRecord);
    console.log(this.userExpenseCategories);
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

  private getDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
      console.log('by pressing ESC');
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log('by clicking on a backdrop')
    } else {
      console.log(`with: ${reason}`);
    }
  }

  search: OperatorFunction<string, readonly {_id: string, name: string}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.userExpenseCategories.filter(category => new RegExp(term, 'mi').test(category.name)).slice(0, 10))
  )
}
