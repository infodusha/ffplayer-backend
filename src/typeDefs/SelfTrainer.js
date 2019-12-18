import apollo from 'apollo-server-express';

export const SelfTrainer = apollo.gql`
  type SelfTrainer {
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
