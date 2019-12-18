import apollo from 'apollo-server-express';

export const Mutation = apollo.gql`
  type Mutation {
    "Send auth code"
    code(email: String!): Boolean @auth(required: false)
    "Update self info"
    self(pic: Upload, name: String): Boolean @auth
    selfEmailCode(oldEmail: String, newEmail: String): Boolean @auth
    selfEmail(oldEmail: String, newEmail: String, oldCode: String, newCode: String): Boolean @auth
  }
`;
