import { ExpenseCategory } from "./expense-category.entity";

export class ExpenseRecord {
    _id!: string;
    notes!: string;
    amount!: number;
    date!: number;
    expenseCategory!: ExpenseCategory;
}