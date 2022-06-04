import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateIncomeRecordDto } from '../dto/create-income-record.dto';
import { UpdateIncomeRecordDto } from '../dto/update-income-record.dto';
import { CREATE_INCOME_RECORD, DELETE_INCOME_RECORD, GET_INCOME_RECORD, GET_INCOME_RECORDS, UPDATE_INCOME_RECORD } from '../query/income-record.query';

@Injectable({
  providedIn: 'root'
})
export class IncomeRecordService {

  constructor(private readonly apolloClient: Apollo) { }

  createIncomeRecord(incomeSheetId: string, createIncomeRecordDto: CreateIncomeRecordDto){
    return this.apolloClient.mutate({
      mutation: CREATE_INCOME_RECORD,
      variables: {
        incomeSheetId: incomeSheetId,
        createIncomeRecordInput: createIncomeRecordDto,
      }
    });
  }

  updateIncomeRecord(incomeSheetId: string, incomeRecordId: string, updateIncomeRecordDto: UpdateIncomeRecordDto){ 
    return this.apolloClient.mutate({
      mutation: UPDATE_INCOME_RECORD,
      variables: {
        incomeSheetId: incomeSheetId,
        incomeRecordId: incomeRecordId,
        updateIncomeRecordInput: updateIncomeRecordDto
      }
    }) 
  }

  getAllIncomeRecords(incomeSheetId: string) {
    const incomeRecordsSub = this.apolloClient.watchQuery({
      query: GET_INCOME_RECORDS,
      variables: {
        incomeSheetId: incomeSheetId
      }
    });

    return incomeRecordsSub.valueChanges;
  }

  getIncomeRecordById(incomeSheetId: string, incomeRecordId: string){
    const incomeRecordSub = this.apolloClient.watchQuery({
      query: GET_INCOME_RECORD,
      variables: {
        incomeSheetId: incomeSheetId,
        id: incomeRecordId
      }
    });

    return incomeRecordSub.valueChanges;
  }

  removeIncomeRecord(incomeSheetId: string, incomeRecordId: string){  
    return this.apolloClient.mutate({
      mutation: DELETE_INCOME_RECORD,
      variables: {
        incomeSheetId: incomeSheetId,
        id: incomeRecordId,
      }
    });
  }
}
