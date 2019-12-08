import apollo from 'apollo-server-express';

export const Trainer = apollo.gql`
  type Trainer implements Client {
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
