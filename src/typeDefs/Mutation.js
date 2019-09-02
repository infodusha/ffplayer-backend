import apollo from 'apollo-server-express';
const {gql} = apollo;

export default gql`
  type Mutation {
    sendToken(email: String!): Boolean @auth(required: false)
  }
`;
