import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { CreateExpenseRecordDto } from 'src/app/assests-manager-common/dto/create-expense-record.dto';
import { CreateExpenseSheet } from 'src/app/assests-manager-common/dto/create-expense-sheet.dto';
import { ExpenseCategoryService } from 'src/app/assests-manager-common/service/expense-category.service';
import { ExpenseSheetService } from 'src/app/assests-manager-common/service/expense-sheet.service';
import { environment } from 'src/environments/environment';

type ExpenseRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-add-expense-sheet',
  templateUrl: './add-expense-sheet.component.html',
  styleUrls: ['./add-expense-sheet.component.scss']
})
export class AddExpenseSheetComponent implements OnInit, OnChanges, OnDestroy {
  
  calenderModel!: NgbDateStruct;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;

  temporyExpenseRecords: any[] = [];
  temporyExpenseSheetDetails = {};
  userExpenseCategories: any[] = [];
  closeResult: string = '';
  selectedCurrency!: string;
  isDateInputLocked: boolean = false;
  loading: boolean = false;

  expenseRecordCreateForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    expenseCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  formatter = (state: ExpenseRecordType) => state.name;
  
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly expenseSheetService: ExpenseSheetService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.getUserExpesneRecords(environment.userId);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  selectToday() {
    this.calenderModel = this.calendar.getToday();
  }

  resetFormInputDataStatus(){
    this.isDateInputLocked = false;
    this.temporyExpenseRecords = [];
  }

  clearAllExpenseRecords(){
    this.temporyExpenseRecords = [];
  }

  openAddExpenseRecordModal(content: any){
    if(this.calenderModel && this.selectedCurrency){
      this.isDateInputLocked = true;
      const lastDayOfSelectedMonth = DateTime.local(Number(this.calenderModel.year), Number(this.calenderModel.month)).daysInMonth;
      this.allowedMinDateRange = { year: Number(this.calenderModel.year), month: Number(this.calenderModel.month), day: 1 };
      this.allowedMaxDateRange = { year: Number(this.calenderModel.year), month: Number(this.calenderModel.month), day: lastDayOfSelectedMonth }
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        if(result.status === 'VALID'){
          //Selected month and year is in range of expense sheets month and year
          if(result.value.date.month === this.calenderModel.month && result.value.date.year === this.calenderModel.year){
            const newExpenseRecordDto = {
              date: result.value.date.day,
              note: result.value.note,
              amount: Number(result.value.amount),
              expenseCategory: result.value.expenseCategory,
            }
            this.temporyExpenseRecords.push(newExpenseRecordDto);
          }
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      this.toastr.warning('Select a month-year and currency first', 'Required Information is Missing');
    }
  }

  openSaveExpenseSheetConfirmation(content: any, savewithoutExpenseRecordModel?: any){
    if(!this.calenderModel || !this.selectedCurrency){
      this.toastr.warning('Select a Year, Month and Currency to create expense sheet', 'Required Information is Missing');
    }else if(this.temporyExpenseRecords.length <= 0){
      //Confirm user wants to create expense sheet without any record in it
      this.modalService.open(savewithoutExpenseRecordModel, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.ConfirmExpenseSheetCreation();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
    }else {
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.ConfirmExpenseSheetCreation();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
    }
  }

  private ConfirmExpenseSheetCreation(){
    const expenseRecords: CreateExpenseRecordDto[] = this.temporyExpenseRecords.map(((record) => {
      return {
        date: record.date,
        notes: record.note,
        amount: record.amount,
        expenseCategory: record.expenseCategory._id,
      }
    }));
    const createExpenseSheetInput: CreateExpenseSheet = {
      currency: this.selectedCurrency,
      year: this.calenderModel.year,
      month: this.calenderModel.month,
      userId: environment.userId,
      expenseRecords: expenseRecords,
    }

    const data = this.expenseSheetService.createExpenseSheet(createExpenseSheetInput);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.createExpenseSheet && result.data.createExpenseSheet['__typename'] === 'ExpenseSheet'){
            this.loading = false;
            this.toastr.success(`Income Sheet Created for ${result.data.createExpenseSheet.month} of ${result.data.createExpenseSheet.year}`);
          }else if (result.data.createExpenseSheet && result.data.createExpenseSheet['__typename'] === 'ExpenseSheetResultError'){
             const errorModel = result.data.createExpenseSheet;
             this.loading = false;
             this.toastr.warning(errorModel.reason, errorModel.message);
          }else{
            this.loading = false;
            this.toastr.error('Could not create Expense Sheet Something went wrong!', 'Error Creating Expense Sheet');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Could not create Expense Sheet Something went wrong!', 'Error Creating Expense Sheet');
      }
    })
  }

  private getUserExpesneRecords(userId: string){
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
        this.toastr.error('Error getting expense records!, Please try again soon!', 'Error getting data!');
      }
    })
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
