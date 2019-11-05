import apollo from 'apollo-server-express';

export default apollo.gql`
  type Mutation {
    "Send auth code"
    code(email: String!): Boolean @auth(required: false)
    "Update self info"
    self(pic: Upload, name: String, email: String): SelfUpdate @auth
  }
`;
