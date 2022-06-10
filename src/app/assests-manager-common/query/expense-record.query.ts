import { gql } from "apollo-angular";

export const GET_EXPENSE_RECORDS = gql`
    query expenseRecords($expenseSheetId: String!) {
        expenseRecords(expenseSheetId: $expenseSheetId) {
            __typename
            ... on ExpenseRecord {
                expenseRecordId: _id
                notes
                amount
                expenseCategory {
                    _id
                    userId
                    name
                    description
                }
            }

            ... on ExpenseSheet {
                expenseSheetId: _id
                userId
                month
                currency
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        userId
                        name
                        description
                    }
                }
            }

            ... on ExpenseRecordResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const GET_EXPENSE_RECORD = gql`
    query expenseRecord($expenseSheetId: String!, $id: String!){
        expenseRecord(
            expenseSheetId: $expenseSheetId
            id: $id
        ) {
            __typename
            ... on ExpenseRecord {
                notes
                amount
                expenseCategory {
                    _id
                    userId
                    name
                    description
                }
            }

            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        userId
                        name
                    }
                }
            }

            ... on ExpenseRecordResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const CREATE_EXPENSE_RECORD = gql`
    mutation(
        $expenseSheetId: String!
        $createExpenseRecordInput: CreateExpenseRecordInput!
    ) {
        createExpenseRecord(
            expenseSheetId: $expenseSheetId
            createExpenseRecordInput: $createExpenseRecordInput
        ) {
            __typename
            ... on ExpenseRecord {
                expenseRecordId: _id
                notes
                amount
                expenseCategory {
                    _id
                    userId
                    name
                    description
                }
            }

            ... on ExpenseSheet {
                expenseSheetId: _id
                userId
                month
                currency
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        userId
                        name
                    }
                }
            }

            ... on ExpenseRecordResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const UPDATE_EXPENSE_RECORD = gql`
    mutation updateExpenseRecord(
        $expenseSheetId: String!
        $expenseRecordId: String!
        $updateExpenseRecordInput: UpdateExpenseRecordInput!
    ) {
        updateExpenseRecord(
            expenseSheetId: $expenseSheetId
            expenseRecordId: $expenseRecordId
            updateExpenseRecordInput: $updateExpenseRecordInput
        ) {
            __typename
            ... on ExpenseRecord {
                notes
                amount
                expenseCategory {
                    _id
                    userId
                    name
                    description
                }
            }

            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        userId
                        name
                    }
                }
            }

            ... on ExpenseRecordResultError {
                operation
                message
                reason
            }
        }
    }
`;

export const DELETE_EXPENSE_RECORD = gql`
    mutation removeExpenseRecord($expenseSheetId: String!, $id: String!) {
        removeExpenseRecord(expenseSheetId: $expenseSheetId, id: $id) {
            __typename
            ... on ExpenseRecord {
                notes
                amount
                expenseCategory {
                    _id
                    userId
                    name
                    description
                }
            }

            ... on ExpenseSheet {
                _id
                userId
                month
                currency
                expenseRecords {
                    _id
                    date
                    notes
                    amount
                    expenseCategory {
                        _id
                        userId
                        name
                    }
                }
            }

            ... on ExpenseRecordResultError {
                operation
                message
                reason
            }
        }
    }
`;