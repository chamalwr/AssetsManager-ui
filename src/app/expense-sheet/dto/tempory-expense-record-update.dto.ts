import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ExpenseCategory } from "src/app/assests-manager-common/entity/expense-category.entity";

export class TemporyExpenseRecordUpdateDto {
    expenseSheetId!: string;
    expenseRecordId!: string;
    date!: NgbDateStruct;
    note!: string;
    amount!: number;
    expenseCategory!: ExpenseCategory;
}