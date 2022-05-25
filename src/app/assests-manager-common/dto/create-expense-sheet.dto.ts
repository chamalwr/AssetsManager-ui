import { CreateExpenseRecordDto } from "./create-expense-record.dto";

export class CreateExpenseSheet {
    currency!: string;
    year!: number;
    month!: number;
    userId!:string;
    expenseRecords!: CreateExpenseRecordDto[];
}