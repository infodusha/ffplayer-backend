import apollo from 'apollo-server-express';

export default apollo.gql`
  type Trainer implements Client {
    id: ID!
    pic: String!
    name: String!
    rate: Float
    rank: Rank!
    streamer: Boolean
    games: [Game]
  }
`;
