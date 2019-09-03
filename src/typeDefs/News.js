import apollo from 'apollo-server-express';

export default apollo.gql`
  type News {
    id: ID!
    title: String!
    text: String
    date: Date!
  }
`;
