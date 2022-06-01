import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateExpenseRecordDto } from '../dto/create-expense-record.dto';
import { UpdateExpenseRecordDto } from '../dto/update-expense-record.dto';
import { CREATE_EXPENSE_RECORD, DELETE_EXPENSE_RECORD, GET_EXPENSE_RECORD, GET_EXPENSE_RECORDS, UPDATE_EXPENSE_RECORD } from '../query/expense-record.query';

@Injectable({
  providedIn: 'root'
})
export class ExpenseRecordsService {

  constructor(private readonly apolloClient: Apollo) { }

  createExpenseRecord(expenseSheetId: string, createExpenseRecordDto: CreateExpenseRecordDto){
    return this.apolloClient.mutate({
      mutation: CREATE_EXPENSE_RECORD,
      variables: {
        expenseSheetId: expenseSheetId,
        createExpenseRecordInput: createExpenseRecordDto,
      }
    });
  }

  updateExpenseRecord(expenseSheetId: string, expenseRecordId: string, updateExpenseRecordDto: UpdateExpenseRecordDto){
    return this.apolloClient.mutate({
      mutation: UPDATE_EXPENSE_RECORD,
      variables: {
        expenseSheetId: expenseSheetId,
        expenseRecordId: expenseRecordId,
        updateExpenseRecordInput: updateExpenseRecordDto,
      }
    });
  }

  getAllExpenseRecords(expenseSheetId: string){
    const expenseRecords =  this.apolloClient.watchQuery({
      query: GET_EXPENSE_RECORDS,
      variables: {
        expenseSheetId: expenseSheetId,
      }
    });
    return expenseRecords.valueChanges;
  }

  getExpenseRecordById(expenseSheetId: string, expenseRecordId: string){
    const expenseRecord = this.apolloClient.watchQuery({
      query: GET_EXPENSE_RECORD,
      variables: {
        expenseSheetId: expenseSheetId,
        id: expenseRecordId,
      }
    });
    return expenseRecord.valueChanges;
  }

  removeExpenseRecord(expenseSheetId: string, expenseRecordId: string){
    return this.apolloClient.mutate(({
      mutation: DELETE_EXPENSE_RECORD,
      variables: {
        expenseSheetId: expenseSheetId, 
        id: expenseRecordId
      }
    }));
  }
}
