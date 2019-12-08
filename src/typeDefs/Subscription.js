import apollo from 'apollo-server-express';

export const Subscription = apollo.gql`
  type Subscription {
    changedStatus(ids: [Int]!): Status
  }
`;
