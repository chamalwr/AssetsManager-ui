import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';
import { DateTime } from 'luxon';
import { ExpenseRecordSummary } from '../../entity/expense-sheet-summary.entity';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators'
import { ExpenseCategory } from '../../../../app/assests-manager-common/entity/expense-category.entity';
import { ExpenseRecord } from 'src/app/assests-manager-common/entity/expense-record.entity';
import { ExpenseRecordsService } from 'src/app/assests-manager-common/service/expense-records.service';
import { environment } from 'src/environments/environment';
import { TemporyExpenseRecordUpdateDto } from '../../dto/tempory-expense-record-update.dto';
import { UpdateExpenseRecordDto } from 'src/app/assests-manager-common/dto/update-expense-record.dto';

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
  @Input() userExpenseCategories: ExpenseCategory[] = [];

  expenseSheet: ExpenseRecordSummary = {
    _id: '',
    month: 'N/A',
    year: 'N/A',
    totalAmount: '0.00',
    totalIncome: '0.00'
  };

  currentExpenseRecord: ExpenseRecord = {
    _id: '',
    date: 0,
    notes: '',
    amount: 0.00,
    expenseCategory: new ExpenseCategory,
  };

  expenseRecords$: ExpenseRecord[] = [];
  loading: boolean = false;
  userId: string = environment.userId;
  currentSelectedMonth: number = DateTime.now().month;
  currentSelectedYear: number = DateTime.now().year;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;
  
  public model!: ExpenseRecordType;
  formatter = (state: ExpenseRecordType) => state.name;
  filter = new FormControl('');
  closeResult: string = "";
  
  editExpenseRecordForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    expenseCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  constructor(
    private expenseSheetService: ExpenseSheetService,
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
        this.confirmExpenseRecordDeletion(expenseSheetId, expenseRecordId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditExpenseRecord(content: any, expenseSheetId: string, expenseRecordId: string, expenseRecord: ExpenseRecord) {
    const lastDayOfSelectedMonth = DateTime.local(Number(this.currentSelectedYear), Number(this.currentSelectedMonth)).daysInMonth;
    this.allowedMinDateRange = { year: Number(this.currentSelectedYear), month: Number(this.currentSelectedMonth), day: 1 };
    this.allowedMaxDateRange = { year: Number(this.currentSelectedYear), month: Number(this.currentSelectedMonth), day: lastDayOfSelectedMonth }
  
    this.editExpenseRecordForm.setValue({
      date: { year: this.currentSelectedYear, month: this.currentSelectedMonth, day: expenseRecord.date },
      note: expenseRecord.notes,
      expenseCategory: expenseRecord.expenseCategory,
      amount: expenseRecord.amount
    });

    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
        if(result.status === 'VALID'){
          const updatedRecord: TemporyExpenseRecordUpdateDto = {
            expenseSheetId: expenseSheetId,
            expenseRecordId: expenseRecordId,
            date: result.value.date,
            note: result.value.note,
            expenseCategory: result.value.expenseCategory,
            amount: result.value.amount
          }
          this.confirmExpenseRecordUpdate(updatedRecord);
        }
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
            this.currentExpenseSheetInfo.emit(this.expenseSheet);
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

  private confirmExpenseRecordUpdate(updatedExpenseRecord: TemporyExpenseRecordUpdateDto){
    const { expenseSheetId, expenseRecordId } = updatedExpenseRecord;
    const updateExpenseRecordInput: UpdateExpenseRecordDto = {
      date: updatedExpenseRecord.date.day,
      amount: updatedExpenseRecord.amount,
      notes: updatedExpenseRecord.note,
      expenseCategory: updatedExpenseRecord.expenseCategory._id
    }

    const data = this.expenseRecordService.updateExpenseRecord(expenseSheetId, expenseRecordId, updateExpenseRecordInput);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.updateExpenseRecord && result.data.updateExpenseRecord['__typename'] === 'ExpenseSheet' || result.data.updateExpenseRecord['__typename'] === 'ExpenseRecord') {
            this.loading = false;
            this.toastr.success(`Expense Record updated!`, `Expense Record Update Complete`);
            window.location.reload();
          }else if(result.data.updateExpenseRecord && result.data.updateExpenseRecord['__typename'] === 'ExpenseRecordResultError') {
            const errorModel = result.data.updateExpenseRecord;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong, Cannot update Selected Expense Record`, `Expense Record Update Failed`);
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong, Cannot update Selected Expense Record`, `Expense Record Update Failed`);
      }
    });
  }

  private getDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    } else {
    }
  }

  search: OperatorFunction<string, readonly {_id: string, name: string}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.userExpenseCategories.filter(category => new RegExp(term, 'mi').test(category.name)).slice(0, 10))
  )
}
