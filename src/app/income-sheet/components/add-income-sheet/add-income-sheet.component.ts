import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { ToastrService } from 'ngx-toastr';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { CreateIncomeRecordDto } from 'src/app/assests-manager-common/dto/create-income-record.dto';
import { CreateIncomeSheetDto } from 'src/app/assests-manager-common/dto/create-income-sheeet.dto';
import { IncomeCategory } from 'src/app/assests-manager-common/entity/income-category.entity';
import { IncomeCategoryService } from 'src/app/assests-manager-common/service/income-category.service';
import { IncomeSheetService } from 'src/app/assests-manager-common/service/income-sheet.service';
import { environment } from 'src/environments/environment';
import { TemporyIncomeRecord } from '../../dto/tempory-income-record.dto';
import { v4 as uuidv4 } from 'uuid';

type IncomeRecordType = {id: number, name: string};

@Component({
  selector: 'amgr-add-income-sheet',
  templateUrl: './add-income-sheet.component.html',
  styleUrls: ['./add-income-sheet.component.scss']
})
export class AddIncomeSheetComponent implements OnInit {

  calenderModel!: NgbDateStruct;
  allowedMinDateRange!: NgbDateStruct;
  allowedMaxDateRange!: NgbDateStruct;

  temporyIncomeRecords: TemporyIncomeRecord[] = [];
  temporyIncomeSheetDetails = {};
  userIncomeCategories: IncomeCategory[] = [];
  closeResult: string = '';
  selectedCurrency!: string;
  isDateInputLocked: boolean = false;
  loading: boolean = false;

  incomeRecordCreateForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    incomeCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  editRecordForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    note: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    incomeCategory: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  formatter = (state: IncomeRecordType) => state.name;
  

  constructor(
    private readonly incomeCategoryService: IncomeCategoryService,
    private readonly incomeSheetService: IncomeSheetService,
    private readonly toastr: ToastrService,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private calendar: NgbCalendar,
  ) { }

  ngOnInit(): void {
    this.getUserIncomeRecords(environment.userId);
  }

  selectToday() {
    this.calenderModel = this.calendar.getToday();
  }

  resetFormInputDataStatus(){
    this.isDateInputLocked = false;
    this.temporyIncomeRecords = [];
  }

  clearAllIncomeRecords(){
    this.temporyIncomeRecords = [];
  }

  openAddIncomeRecordModal(content: any){
    if(this.calenderModel && this.selectedCurrency){
      this.isDateInputLocked = true;
      const lastDayOfSelectedMonth = DateTime.local(Number(this.calenderModel.year), Number(this.calenderModel.month)).daysInMonth;
      this.allowedMinDateRange = { year: Number(this.calenderModel.year), month: Number(this.calenderModel.month), day: 1 };
      this.allowedMaxDateRange = { year: Number(this.calenderModel.year), month: Number(this.calenderModel.month), day: lastDayOfSelectedMonth }
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        if(result.status === 'VALID'){
          //Selected month and year is in range of income sheets month and year
          if(result.value.date.month === this.calenderModel.month && result.value.date.year === this.calenderModel.year){
            const newIncomeRecordDto: TemporyIncomeRecord = {
              temporyId: uuidv4(),
              date: result.value.date,
              note: result.value.note,
              amount: Number(result.value.amount),
              incomeCategory: result.value.incomeCategory,
            }
            this.temporyIncomeRecords.push(newIncomeRecordDto);
          }
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      this.toastr.warning('Select a month-year and currency first', 'Required Information is Missing');
    }
  }

  openSaveIncomeSheetConfirmation(content: any, savewithoutIncomeRecordModel?: any){
    if(!this.calenderModel || !this.selectedCurrency){
      this.toastr.warning('Select a Year, Month and Currency to create income sheet', 'Required Information is Missing');
    }else if(this.temporyIncomeRecords.length <= 0){
      //Confirm user wants to create income sheet without any record in it
      this.modalService.open(savewithoutIncomeRecordModel, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.confirmIncomeSheetCreation();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
    }else {
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.confirmIncomeSheetCreation();
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
    }
  }

  editSelectedIncomeRecord(content: any, incomeRecordTemporyId: string){
    const incomeRecord = this.temporyIncomeRecords.find((record) => record.temporyId === incomeRecordTemporyId);
    if(incomeRecord){
      this.editRecordForm.setValue({
        date: incomeRecord?.date,
        note: incomeRecord?.note,
        incomeCategory: incomeRecord?.incomeCategory,
        amount: incomeRecord?.amount,
      });
      this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        if(result.status === 'VALID'){
          this.temporyIncomeRecords.map((record)=> {
            if(record.temporyId === incomeRecord.temporyId){
              record.date = result.value.date,
              record.note = result.value.note,
              record.incomeCategory = result.value.incomeCategory,
              record.amount = result.value.amount
            }
          })
        }
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  deleteSelectedIncomeRecord(content:any, incomeRecordTemporyId: string){
    console.log(`Delete this ${incomeRecordTemporyId}`);
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.confirmTempIncomeRecordDeletion(incomeRecordTemporyId);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });;
  }

  private confirmTempIncomeRecordDeletion(incomeRecordTemporyId: string){
    this.temporyIncomeRecords = this.temporyIncomeRecords.filter((record) => record.temporyId !== incomeRecordTemporyId);
  }

  private confirmIncomeSheetCreation(){
    const incomeRecords: CreateIncomeRecordDto[] = this.temporyIncomeRecords.map(((record) => {
      return {
        date: record.date.day,
        notes: record.note,
        amount: record.amount,
        incomeCategory: record.incomeCategory._id,
      }
    }));
    const createIncomeSheetInput: CreateIncomeSheetDto = {
      currency: this.selectedCurrency,
      year: this.calenderModel.year,
      month: this.calenderModel.month,
      userId: environment.userId,
      incomeRecords: incomeRecords,
    }

    const data = this.incomeSheetService.createIncomeSheet(createIncomeSheetInput);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.createIncomeSheet && result.data.createIncomeSheet['__typename'] === 'IncomeSheet'){
            this.loading = false;
            this.toastr.success(`Income Sheet Created for ${result.data.createIncomeSheet.month} of ${result.data.createIncomeSheet.year}`);
          }else if (result.data.createIncomeSheet && result.data.createIncomeSheet['__typename'] === 'IncomeSheetResultError'){
             const errorModel = result.data.createIncomeSheet;
             this.loading = false;
             this.toastr.warning(errorModel.reason, errorModel.message);
          }else{
            this.loading = false;
            this.toastr.error('Could not create Income Sheet Something went wrong!', 'Error Creating Income Sheet');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Could not create Income Sheet Something went wrong!', 'Error Creating Income Sheet');
      }
    });
  }

  private getUserIncomeRecords(userId: string){
    const data = this.incomeCategoryService.getAllIncomeCategories(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.incomeCategories && result.data.incomeCategories[0]['__typename'] === 'IncomeCategory'){
            this.userIncomeCategories = result.data.incomeCategories;
            this.loading = false;
          }else if(result.data.incomeCategories && result.data.incomeCategories[0]['__typename'] === 'IncomeCategoryResultError') {
            const errorModel = result.data.incomeCategories[0];
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.warning(`Something went wrong cannot fetch income categories for current user`, 'Income Category Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Error getting income records!, Please try again soon!', 'Error getting data!');
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
    map(term => this.userIncomeCategories.filter(category => new RegExp(term, 'mi').test(category.name)).slice(0, 10))
  )

}
