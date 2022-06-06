import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UpdateIncomeSheetDto } from 'src/app/assests-manager-common/dto/update-income-sheet.dto';
import { IncomeSheetService } from 'src/app/assests-manager-common/service/income-sheet.service';
import { IncomeSheetSummary } from '../../entity/income-sheet-summary.entity';

@Component({
  selector: 'amgr-income-sheet-all-view',
  templateUrl: './income-sheet-all-view.component.html',
  styleUrls: ['./income-sheet-all-view.component.scss']
})
export class IncomeSheetAllViewComponent implements OnInit {
  
  @Output() selectedIncomeSheetForDetailedView = new EventEmitter<any>();
  incomeSheetsSummary: IncomeSheetSummary[] = [];
  filter = new FormControl('');
  loading: boolean = false;
  closeResult: string = "";

  editIncomeSheetForm = new FormGroup({
    date: new FormControl(null, [Validators.required]),
    currency: new FormControl(null, [Validators.required]),
  });

  constructor(
    private incomeSheetService: IncomeSheetService,
    private readonly toastr: ToastrService,
    pipe: DecimalPipe,
    private modalService: NgbModal,
    public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  viewSelectedIncomeSheet(incomeSheetSummary: IncomeSheetSummary){
    this.selectedIncomeSheetForDetailedView.emit(incomeSheetSummary);
  }

  getIncomeSheetSummary(userId: string){
    const data = this.incomeSheetService.getAllIncomeSheetSummary(userId);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.incomeSheets && result.data.incomeSheets[0]['__typename'] === 'IncomeSheet'){
            this.incomeSheetsSummary = result.data.incomeSheets;
            this.loading = false;
          }else if(result.data.incomeSheets && result.data.incomeSheets[0]['__typename'] === 'IncomeSheetResultError'){
            const errorModel = result.data.incomeSheets[0];
            this.toastr.warning(errorModel.reason, errorModel.message);
            this.loading = false;
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot fetch all Income Sheets`, 'Error')
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot fetch all Income Sheets`, 'Error')
      }
    })
  }

  deleteIncomeSheetConfirmation(content: any, id: string, ){
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.deleteIncomeSheet(id);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editIncomeSheet(content: any, incomeSheet: IncomeSheetSummary){
    this.editIncomeSheetForm.setValue({
      date: { year: incomeSheet.year, month: incomeSheet.month, day: 1 },
      currency: incomeSheet.currency,
    });
    this.modalService.open(content, { animation: true, centered: true, ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if(result.status === 'VALID'){
        const updateIncomeSheetDto: UpdateIncomeSheetDto = {
          year: result.value.date.year,
          month: result.value.date.month,
          currency: result.value.currency
        }
        this.confirmUpdateIncomeSheet(incomeSheet._id, updateIncomeSheetDto);
      }
    }, (reason) => {
    });
  }

  private confirmUpdateIncomeSheet(incomeSheetId: string, updateIncomeSheetDto: UpdateIncomeSheetDto){
    const data = this.incomeSheetService.updateIncomeSheet(incomeSheetId, updateIncomeSheetDto);
    data.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true
        }else {
          if(result.data.updateIncomeSheet && result.data.updateIncomeSheet['__typename'] === 'IncomeSheet'){
            this.loading = false;
            this.toastr.success('Income Sheet Details Updated Complete', 'Income Sheet Update');
          }else if(result.data.updateIncomeSheet && result.data.updateIncomeSheet['__typename'] === 'IncomeSheetResultError') {
            const errorModel = result.data.updateIncomeSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error('Something went wrong, Update Failed', 'Income Sheet Update Failed');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error('Something went wrong, Update Failed', 'Income Sheet Update Failed');
      }
    });
  }

  private deleteIncomeSheet(id: string){
    const deletedIncomeSheet = this.incomeSheetService.deleteIncomeSheet(id);
    deletedIncomeSheet.subscribe({
      next: (result: any) => {
        if(result.loading){
          this.loading = true;
        }else {
          if(result.data.removeIncomeSheet && result.data.removeIncomeSheet['__typename'] === 'IncomeSheet') {
            this.loading = false;
            window.location.reload();
            this.toastr.success(`Income Sheet for ${result.data.removeIncomeSheet.month}-${result.data.removeIncomeSheet.year} deleted!`, `Income Sheet Deletion Success`);
          }else if (result.data.removeIncomeSheet && result.data.removeIncomeSheet['__typename'] === 'IncomeSheetResultError') {
            const errorModel = result.data.removeIncomeSheet;
            this.loading = false;
            this.toastr.warning(errorModel.reason, errorModel.message);
          }else {
            this.loading = false;
            this.toastr.error(`Something went wrong!, Cannot delete selected Income sheet`, 'Error');
          }
        }
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(`Something went wrong!, Cannot delete selected Income sheet`, 'Error');
      }
    })
  }

  search(text: string, pipe: PipeTransform) {
  }

  private getDismissReason(reason: any): void {
    if (reason === ModalDismissReasons.ESC) {
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    } else {
    }
  }
}
