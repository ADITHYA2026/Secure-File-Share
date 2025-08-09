/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFileMeta = /* GraphQL */ `
  query GetFileMeta($id: ID!) {
    getFileMeta(id: $id) {
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
export const listFileMetas = /* GraphQL */ `
  query ListFileMetas(
    $filter: ModelFileMetaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFileMetas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        filename
        fileKey
        expiry
        password
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
