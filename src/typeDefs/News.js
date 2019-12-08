import apollo from 'apollo-server-express';

export const News = apollo.gql`
  type News {
    id: ID!
    title: String!
    text: String
    date: Date!
  }
`;
