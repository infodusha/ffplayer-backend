import {gql} from '../modules/apollo.js';

export const News = gql`
  type News {
    id: ID!
    title: String!
    text: String
    date: Date!
  }
`;
