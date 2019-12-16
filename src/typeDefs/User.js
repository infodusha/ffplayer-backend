import {gql} from '../modules/apollo.js';

export const User = gql`
  type User {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
    reviews: [Review]
    trains: Int!
    online: Boolean!
  }
`;
