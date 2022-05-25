import { ExpenseCategory } from "./expense-category.entity";

export class ExpenseRecord {
    expenseRecordId!: string;
    notes!: string;
    amount!: number;
    date!: number;
    expenseCategory!: ExpenseCategory;
}