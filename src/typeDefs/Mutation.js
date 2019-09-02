import apollo from 'apollo-server-express';

export default apollo.gql`
  type Mutation {
    sendToken(email: String!): Boolean @auth(required: false)
  }
`;
