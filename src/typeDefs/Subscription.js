import apollo from 'apollo-server-express';

export default apollo.gql`
  type Subscription {
    changedStatus(ids: [Int]!): Status
  }
`;
