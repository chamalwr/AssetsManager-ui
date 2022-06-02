import { gql } from "apollo-angular";

export const GET_INCOME_RECORDS = gql`
    query incomeRecords($incomeSheetId: String!){
        incomeRecords(incomeSheetId: $incomeSheetId){
            __typename
            ... on IncomeSheet {
                incomeSheetId: _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    amount
                    incomeCategory {
                        _id
                        description
                    }
                }
            }

            ... on IncomeRecord {
                incomeRecordId: _id
                notes
                amount
                incomeCategory {
                    _id
                    userId
                    description
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

export const GET_INCOME_RECORD = gql`
    query incomeRecord($incomeSheetId: String!, $id: String!){
        incomeRecord(incomeSheetId: $incomeSheetId, id: $id){
            __typename
            ... on IncomeSheet {
                incomeSheetId: _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    amount
                    incomeCategory {
                        _id
                        description
                    }
                }
            }

            ... on IncomeRecord {
                incomeRecordId: _id
                date
                notes
                amount
                incomeCategory {
                    _id
                    userId
                    description
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

export const CREATE_INCOME_RECORD = gql`
    mutation createIncomeRecord($incomeSheetId: String!, $createIncomeRecordInput: CreateIncomeRecordInput!) {
        createIncomeRecord(incomeSheetId: $incomeSheetId, createIncomeRecordInput: $createIncomeRecordInput) {
            __typename
            ... on IncomeSheet {
                incomeSheetId:  _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    amount
                    incomeCategory {
                        _id
                        description
                    }
                }
            }

            ... on IncomeRecord {
                incomeRecordId: _id
                notes
                amount
                incomeCategory {
                    _id
                    userId
                    description
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

export const UPDATE_INCOME_RECORD = gql`
    mutation updateIncomeRecord($incomeSheetId: String!, $incomeRecordId: String!, $updateIncomeRecordInput: UpdateIncomeRecordInput!){
        updateIncomeRecord(incomeSheetId: $incomeSheetId, incomeRecordId: $incomeRecordId, updateIncomeRecordInput: $updateIncomeRecordInput){
            __typename
            ... on IncomeSheet  {
                incomeSheetId: _id
                userId
                month
                year
                currency
                incomeRecords {
                    _id
                    notes
                    amount
                    incomeCategory {
                        _id
                        description
                    }
                }
            }

            ... on IncomeRecord {
                incomeRecordId: _id
                notes
                amount
                incomeCategory {
                    _id
                    userId
                    description
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

export const DELETE_INCOME_RECORD = gql`
    mutation removeIncomeRecord($incomeSheetId: String!, $id: String!) {
        removeIncomeRecord(incomeSheetId: $incomeSheetId, id: $id){
            __typename
            ... on IncomeSheet {
            incomeSheetId: _id
                userId
                month
                year
                currency
                totalAmount
                incomeRecords {
                    _id
                    notes
                    amount
                    incomeCategory {
                        _id
                        description
                    }
                }
            }

            ... on IncomeRecord {
                incomeRecordId: _id
                notes
                amount
                incomeCategory {
                    _id
                    userId
                    description
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