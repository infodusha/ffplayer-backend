import {gql} from '../modules/apollo.js';

export const SelfUser = gql`
  type SelfUser {
    id: ID!
    pic: String!
    name: String!
    games: [Game]
    reviews: [Review]
    trains: Int!
    online: Boolean!
  }
`;
