import { gql } from "apollo-angular";

export const GET_EXPENSE_SHEETS = gql`
    query expenseSheets($userId: String!){
        expenseSheets(userId: $userId) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                totalAmount
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        name
                        description
                    }
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_SHEETS_SUMMARY = gql`
    query expenseSheets($userId: String!){
        expenseSheets(userId: $userId) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                totalAmount
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_SHEET = gql`
    query expenseSheet($id: String!) {
        expenseSheet(id: $id) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_SHEET_BY_MONTH_AND_YEAR = gql`
    query expeseSheetByMonthAndYear(
        $userId: String!
        $month: Float!
        $year: Float!
    ) {
        expeseSheetByMonthAndYear(userId: $userId, month: $month, year: $year) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                totalAmount
                expenseRecords {
                    _id
                    notes
                    date
                    amount
                    expenseCategory {
                        _id
                        name
                        description
                    }
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_SHEETS_BY_YEAR = gql`
    query expeseSheetsByYear($userId: String!, $year: Float!) {
        expeseSheetsByYear(userId: $userId, year: $year) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                totalAmount
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        name
                        description
                    }
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const CREATE_EXPENSE_SHEET = gql`
    mutation createExpenseSheet(
        $createExpenseSheetInput: CreateExpenseSheetInput!
    ) {
        createExpenseSheet(createExpenseSheetInput: $createExpenseSheetInput) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }

`;

export const DELETE_EXPENSE_SHEET = gql`
    mutation removeExpenseSheet($id: String!) {
        removeExpenseSheet(id: $id) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const UPDATE_EXPENSE_SHEET = gql`
    mutation($id: String!, $updateExpenseSheetInput: UpdateExpenseSheetInput!) {
        updateExpenseSheet(
            id: $id
            updateExpenseSheetInput: $updateExpenseSheetInput
        ) {
            __typename
            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                year
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                }
            }

            ... on ExpenseSheetResultError {
                operation
                message
                reason
            }
        }
    }
`;