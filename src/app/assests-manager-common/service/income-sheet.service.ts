import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CreateIncomeSheetDto } from '../dto/create-income-sheeet.dto';
import { UpdateIncomeSheetDto } from '../dto/update-income-sheet.dto';
import { CREATE_INCOME_SHEET, DELETE_INCOME_SHEET, GET_INCOME_SHEET, GET_INCOME_SHEETS, GET_INCOME_SHEETS_BY_YEAR, GET_INCOME_SHEET_BY_MONTH_AND_YEAR, GET_INCOME_SHEET_SUMMARY, UPDATE_INCOME_SHEET } from '../query/income-sheet.query';

@Injectable({
  providedIn: 'root'
})
export class IncomeSheetService {

  constructor(private readonly apolloClient: Apollo) { }

  getAllIncomeSheet(userId: string){
    const allIncomeSheetsSub = this.apolloClient.watchQuery({
      query: GET_INCOME_SHEETS,
      variables: {
        userId: userId
      }
    });

    return allIncomeSheetsSub.valueChanges;
  }

  getAllIncomeSheetSummary(userId: string) {
    const allIncomeSheetSummarySub = this.apolloClient.watchQuery({
      query: GET_INCOME_SHEET_SUMMARY,
      variables: {
        userId: userId
      }
    });

    return allIncomeSheetSummarySub.valueChanges;
  }

  getIncomeSheetById(id: string) {
    const incomeSheetSub = this.apolloClient.watchQuery({
      query: GET_INCOME_SHEET,
      variables: {
        id: id
      }
    });

    return incomeSheetSub.valueChanges;
  }

  getIncomeSheetsByMonthAndYear(userId: string, year: number, month: number) {
    const incomeSheetByPeriodSub = this.apolloClient.watchQuery({
      query: GET_INCOME_SHEET_BY_MONTH_AND_YEAR,
      variables: {
        userId: userId,
        year: year,
        month: month,
      }
    });

    return incomeSheetByPeriodSub.valueChanges;
  }

  getIncomeSheetsByYear(userId: string, year: number) {
    const incomeSheetByYearSub = this.apolloClient.watchQuery({
      query: GET_INCOME_SHEETS_BY_YEAR,
      variables: {
        userId: userId,
        year: year,
      }
    });

    return incomeSheetByYearSub.valueChanges;
  }

  createIncomeSheet(createIncomeSheetDto: CreateIncomeSheetDto){
    return this.apolloClient.mutate({
      mutation: CREATE_INCOME_SHEET,
      variables: {
        createIncomeSheetInput: createIncomeSheetDto
      }
    });
  }

  deleteIncomeSheet(id: string) {
    return this.apolloClient.mutate({
      mutation: DELETE_INCOME_SHEET,
      variables: {
        id: id
      }
    });
  }

  updateIncomeSheet(id: string, updateIncomeSheetDto: UpdateIncomeSheetDto) {
    return this.apolloClient.mutate({
      mutation: UPDATE_INCOME_SHEET,
      variables: {
        id: id,
        updateIncomeSheetInput: updateIncomeSheetDto
      }
    });
  }

}
