import {gql} from '../modules/apollo.js';

export const Trainer = gql`
  type Trainer {
    id: ID!
    pic: String!
    name: String!
    rate: Float!
    rateData: RateData
    rank: Rank!
    streamer: Boolean!
    games: [Game]
    reviews: [Review]
    trains: Int!
    students: Int!
    online: Boolean!
  }
`;
