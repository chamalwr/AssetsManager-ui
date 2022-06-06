import { gql } from "apollo-angular";

export const GET_INCOME_SHEETS = gql`
    query incomeSheets($userId: String!) {
        incomeSheets(userId: $userId){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                totalAmount
                incomeRecords {
                    _id
                    notes
                    date
                    amount
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }
    
            ... on IncomeSheetResultError{
                operation
                message
                reason
            }
        }
    }
`;

export const GET_INCOME_SHEET_SUMMARY = gql`
     query incomeSheets($userId: String!) {
        incomeSheets(userId: $userId){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                totalAmount
            }
    
            ... on IncomeSheetResultError{
                operation
                message
                reason
            }
        }
    }
`;

export const GET_INCOME_SHEET = gql`
    query incomeSheet($id: String!){
        incomeSheet(id: $id){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                totalAmount
                incomeRecords {
                    _id
                    notes
                    date
                    amount
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }
    
            ... on IncomeSheetResultError{
                operation
                message
                reason
            }
        }
    }
`;

export const GET_INCOME_SHEET_BY_MONTH_AND_YEAR = gql`
    query incomeSheetByMonthAndYear($userId: String!, $year: Float!, $month: Float!) {
        incomeSheetByMonthAndYear(userId: $userId, year: $year, month: $month){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                totalAmount
                incomeRecords {
                    _id
                    notes
                    date
                    amount
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }

            ... on IncomeSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_INCOME_SHEETS_BY_YEAR = gql`
    query incomeSheetsByYear($userId: String!, $year: Float!){
        incomeSheetsByYear(userId: $userId, year: $year){
            __typename
            ... on IncomeSheet {
            _id
            userId
            month
            year
            currency
            totalAmount
            incomeRecords {
                _id
                notes
                date
                amount
                incomeCategory {
                    _id
                    name
                    description
                }
            }
            }

            ... on IncomeSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const CREATE_INCOME_SHEET = gql`
    mutation createIncomeSheet($createIncomeSheetInput: CreateIncomeSheetInput!){
        createIncomeSheet(createIncomeSheetInput: $createIncomeSheetInput){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                totalAmount
                incomeRecords {
                    _id
                    notes
                    date
                    amount
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }
    
            ... on IncomeSheetResultError{
                operation
                message
                reason
            }
        }
    }
`;

export const DELETE_INCOME_SHEET = gql`
    mutation removeIncomeSheet($id: String!) {
        removeIncomeSheet(id: $id){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    date
                    amount
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }
    
            ... on IncomeSheetResultError{
                operation
                message
                reason
            }
        }
    }
`;

export const UPDATE_INCOME_SHEET = gql`
    mutation updateIncomeSheet($id: String!, $updateIncomeSheetInput: UpdateIncomeSheetInput!){
        updateIncomeSheet(id: $id, updateIncomeSheetInput: $updateIncomeSheetInput){
            __typename
            ... on IncomeSheet {
                _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    amount
                    date
                    incomeCategory {
                        _id
                        name
                        description
                    }
                }
            }

            ... on IncomeSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;