/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFileMeta = /* GraphQL */ `
  mutation CreateFileMeta(
    $input: CreateFileMetaInput!
    $condition: ModelFileMetaConditionInput
  ) {
    createFileMeta(input: $input, condition: $condition) {
      id
      filename
      fileKey
      expiry
      password
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFileMeta = /* GraphQL */ `
  mutation UpdateFileMeta(
    $input: UpdateFileMetaInput!
    $condition: ModelFileMetaConditionInput
  ) {
    updateFileMeta(input: $input, condition: $condition) {
      id
      filename
      fileKey
      expiry
      password
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFileMeta = /* GraphQL */ `
  mutation DeleteFileMeta(
    $input: DeleteFileMetaInput!
    $condition: ModelFileMetaConditionInput
  ) {
    deleteFileMeta(input: $input, condition: $condition) {
      id
      filename
      fileKey
      expiry
      password
      createdAt
      updatedAt
      __typename
    }
  }
`;
