import {gql} from '../modules/apollo.js';

export const Subscription = gql`
  type Subscription {
    changedStatus(ids: [Int]!): Status
  }
`;
