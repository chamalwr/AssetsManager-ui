import { CreateIncomeRecordDto } from "./create-income-record.dto";

export class CreateIncomeSheetDto {
    month!: number;
    year!: number;
    currency!: string;
    userId!: string;
    incomeRecords!: CreateIncomeRecordDto[];
}